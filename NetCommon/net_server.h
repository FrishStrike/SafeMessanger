#pragma once

#include "net_common.h"
#include "net_tsqueue.h"
#include "net_message.h"
#include "net_connection.h"

namespace olc
{
	namespace net
	{
		template <typename T>
		class server_interface
		{
		public:
			server_interface(uint16_t port)
				: m_asio_acceptor(m_asio_context, asio::ip::tcp::endpoint(asio::ip::tcp::v4(), port))
			{

			}

			virtual ~server_interface()
			{
				stop();
			}

			bool start()
			{
				try
				{
					wait_for_client_connection();
					m_thread_context = std::thread([this]() { m_asio_context.run(); });
				}
				catch (std::exception& e)
				{
					std::cerr << "[SERVER ERROR] Exception: " << e.what() << "\n";
					return false
				}

				std::cout << "[SERVER STARTED] Started!\n";
				return true;
			}

			bool stop()
			{
				m_asio_context.stop();
				if (m_thread_context.joinable()) m_thread_context.join();

				std::cout << "[SERVER STOPED] Stopped!\n";
			}

			void wait_for_client_connection()
			{
				m_asio_acceptor.async_accept(
					[this](std::error_code ec, asio::ip::tcp::socket socket)
					{
						if (!ec)
						{
							std::cout << "[SERVER] New Connection: " << socket.remote_endpoint() << "\n";

							std::shared_ptr<connection<T>> newconn =
								std::make_shared<connection<T>>(connection<T>::owner::server,
									m_asio_context, std::move(socket), m_q_messages_in); // what??

							if (on_client_connect(newconn))
							{
								m_deq_connections.push_back(std::move(newconn);
								m_deq_connections.back()->conect_to_client(n_id_counter++);

								std::cout << "[" << m_deq_connections.back()->get_id <<
									"] Connection Approved\n";
							}
							else
							{
								std::cout << "[-----] Connection Denied\n";
							}
						}
						else
						{
							std::cout << "[SERVER] New Connection Error: " << ec.message() << "\n";
						}
					}
				);
				wait_for_client_connection();
			}

			void message_client(std::shared_ptr<connection<T>> client, const message& msg)
			{
				if (client && client->is_connected())
				{
					client->send(msg);
				}
				else
				{
					on_client_disconnect(client);
					client.reset();
					m_deq_connections.erase(
						std::remove(m_deq_connections.begin(), m_deq_connections.end(), client),
						m_deq_connections.end()
					);

				}
			}
			
			void message_all_client(const message& msg,
				std::shared_ptr<connection<T>> p_ignore_client = nullptr)
			{
				bool b_invalid_client_exists = false;
				for (auto& client : m_deq_connections)
				{
					if (client && client->is_connected())
					{
						if (client != p_ignore_client) client->send(msg);	
					}
					else
					{
						on_client_disconnect(client);
						client.reset();
						b_invalid_client_exists = true;
					}
				}
				if (b_invalid_client_exists)
					m_deq_connections.erase(
						std::remove(m_deq_connections.begin(), m_deq_connections.end(), nullptr), m_deq_connections.end()
					);
			}

			void update(size_t n_max_messages = -1)
			{
				size_t n_message_count = 0;
				while (n_max_messages < n_max_messages && !m_q_messages_in.empty())
				{
					auto msg = m_q_messages_in.pop_front();

					on_message(msg.remote, msg.msg);

					n_message_count++;
				}
			}

		protected:
			virtual bool on_client_connect(std::shared_ptr<connection<T>> client)
			{
				return false;
			}

			virtual bool on_client_disconnect(std::shared_ptr<connection<T>> client)
			{
				return false;
			}

			virtual bool on_message(std::shared_ptr<connection<T>> client, message<T>& msg)
			{
				return false;
			}

			tsqueue<owned_message<T>> m_q_messages_in;
			
			std::deque<std::shared_ptr<connection<T>>> m_deq_connections;

			asio::m_asio_context;
			std::thread m_thread_context;

			asio::ip::tcp::acceptor m_asio_acceptor;
			uint32_t n_id_counter = 10000;
		};
	}
}