#pragma once

#include "net_common.h"
#include "net_tsqueue.h"
#include "net_message.h"

namespace olc
{
	namespace net
	{
		template <typename T>
		class connection : public std::enable_shared_from_this<connection<T>>
		{
		public:
			enum class owner
			{
				server,
				client
			};

			connection(owner parent, asio::io_context& asio_context, asio::ip::tcp::socket socket, tsqueue<owned_message<T>>& q_in)
				: m_asio_context(asio_context), m_socket(std::move(socket)), m_q_messages_in(q_in)
			{
				m_n_owner_type = parent;
			}

			virtual ~connection()
			{}

			uint32_t get_id() const
			{
				return id;
			}

			void connect_to_client(uint32_t uid = 0)
			{
				if (m_n_owner_type == owner::server)
				{
					if (m_socket.is_open())
					{
						id = uid;
						read_header();
					}
				}
			}

			bool connect_to_server(const asio::ip::tcp::resolver::results_type& endpoints) 
			{
				if (m_n_owner_type == owner::client)
				{
					asio::async_connect(m_socket, endpoints,
						[this](std::error_code ec, asio::ip::tcp::endpoint endpoint)
						{
							if (!ec)
							{
								read_header();
							}
						});
				}
			};
			bool disconnect() 
			{
				asio::post(m_asio_context, [this]() { m_socket.close(); })
			};
			bool is_connected() const
			{
				return m_socket.is_open();
			};

			bool send(const message<T>& msg)
			{
				asio::post(m_asio_context,
					[this, msg]()
					{
						bool b_writing_message = !m_q_messages_out.empty();
						m_q_messages_out.push_back(msg);
						if (!b_writing_message)
						{
							write_header();
						}
					});
			};

		private:
			void read_header()
			{
				asio::asinc_read(m_socket, asio::buffer(&m_msg_temporary_in.header, sizeof(message_header<T>),
					[this](std::error_code ec, std::sixe_t length)
					{
						if (!ec)
						{
							if (m_msg_temporary_in.header.size > 0)
							{
								m_msg_temporary_in.body.resize(m_msg_temporary_in.header.size);
								read_body();
							}
							else
							{
								add_to_incoming_message_queue();
							}
						}
						else
						{
							std::cout << "[" << id << "] Read Header Fail.\n";
							m_socket.close();
						}
					});
			}
			void read_body()
			{
				asio::async_read(m_socket, asio::buffer(m_msg_temporary_in.body.data(), m_msg_temporary_in.body.size()),
					[this](std::error_code ec, std::size_t length)
					{
						if (!ec)
						{
							add_to_incoming_message_queue();
						}
						else
						{
							std::cout << "[" << id << "] Read Body Fail.\n";
							m_socket.close();
						}
					})
			}

			void add_to_incoming_message_queue()
			{
				if (m_n_owner_type == owner::server)
					m_q_messages_in.push_back({ this->shared_from_this(), m_msg_temporary_in });
				else
					m_q_messages_in.push_back({ nullptr, m_msg_temporary_in });
				read_header();
			}

			void write_header()
			{
				asio::async_write(m_socket, asio::buffer(&m_q_messages_out.front().header, sizeof(message_header<T>)),
					[this](std::error_code ec, std::size_t length
						{
							if (!ec)
							{
								if (m_q_messages_out.front().body.size() > 0)
								{
									write_body();
								}
								else
								{
									m_q_messages_out.pop_front();
									if (!m_q_messages_out.empty())
									{
										write_header();
									}
								}
							}
						});
			}

			void write_body()
			{
				asio::async_write(m_socket, asio::buffer(&m_q_messages_out.front().body.data(), m_q_messages_out.body.size()),
					[this](std::error_code ec, std::size_t length
						{
							if (!ec)
							{
								m_q_messages_out.pop_front();

								if (!m_q_messages_out.empty())
								{
									write_header();
								}
							}
							else
							{
								std::cout << "[" << id << "] Write Body Fail.]\n";
								m_socket.close();
							}
						}
			}

		protected:
			asio::ip::tcp::socket m_socket;
			asio::io_context& m_asio_context;

			tsqueue<message<T>> m_q_messages_out;
			tsqueue<owned_message>& m_q_messages_in;
			message<T> m_msg_temporary_in;

			owner m_n_owner_type = owner::server;
			uint32_t id = 0;
		};
	}
}