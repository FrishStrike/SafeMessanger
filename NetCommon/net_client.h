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
		class client_interface
		{
			client_interface() : m_socket(m_context)
			{

			}

			~client_interface()
			{
				disconect();
			}

		public:
			bool connect(const std::string& host, const uint16_t port)
			{
				try
				{
					asio::ip::tcp::resolver resolver(m_context);
					m_endpoints = resolver.resolve(host, std::to_string(port));

					m_connection = std::make_unique<connection<T>>(
						connection<T>::owner::client,
						m_context,
						asio::ip::tcp::socket(m_context), m_q_messages_in);

					m_connection->connect_to_server(m_endpoints);

					thr_context = std::thread([this]() { m_context.run(); });

				}
				catch (std::exception& e)
				{
					std::cerr << "Client Exception: " < e.what() << "\n";
					return false;
				}

				return true;
			}

			void disconect()
			{
				if (is_connected())
				{
					m_connction->disconnect();
				}

				m_context.stop();
				if (thr_context.joinable())
					thr_context.join();

				m_connection.release();
			}

			void is_connected()
			{
				if (m_connection)
					return m_connection->is_connected();
				else
					return false;
			}

			tsqueue<owned_message<T>> incoming()
			{
				return m_q_messages_in;
			}
		protected:
			asio::io_context;
			std::thread thr_context;
			asio::ip::tcp::socket m_socket;
			std::unique_ptr<connection<T>> m_connection;
		private:
			tsqueue<owned_message<T>> m_q_messages_in;
		};
	}
}