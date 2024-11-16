#include <iostream>
#include <asio.hpp>
#include <set>
#include <memory>
#include <locale>
#include <mutex>

#ifdef _WIN32
#define _WIN32_WINNT 0x0A00
#endif

using asio::ip::tcp;

std::set<std::shared_ptr<tcp::socket>> clients;

class ChatServer {
public:
	ChatServer(short port)
		: acceptor_(io_context_, tcp::endpoint(tcp::v4(), port)), idle_work_(io_context_) {
		start_accept();
	}

	void run() {
		std::cout << "Server is waiting...\n";
		io_context_.run();
	}
private:
	void start_accept() {
		auto client_socket = std::make_shared<tcp::socket>(io_context_);
		acceptor_.async_accept(*client_socket, [this, client_socket]
		(std::error_code ec) {
				if (!ec) {
					std::cout << "new user!\n";
					std::lock_guard<std::mutex> lock(clients_mutex);  // Блокировка при добавлении 
					clients.insert(client_socket);
					start_reading(client_socket);
				}
				start_accept();
			});
		/*run();*/
		using namespace std::chrono_literals;
		std::this_thread::sleep_for(2000ms);
	}

	void start_reading(std::shared_ptr<tcp::socket> client_socket) {
		//auto buffer = new std::array<char, 1024>;
		auto buffer = std::make_shared<std::array<char, 1024>>();
		client_socket->async_read_some(asio::buffer(*buffer, sizeof(char)*1024), [this, client_socket, buffer]
			(std::error_code ec, std::size_t length)
			{
				if (!ec) {
					if (length > 0) {
						std::string message(buffer->data(), length);
						std::cout << "message is recieved!\n";
						broadcast_message(message, client_socket);

						start_reading(client_socket);
					}
				}
				else {
					std::lock_guard<std::mutex> lock(clients_mutex);  // Блокировка при удалении клиента
					std::cerr << "User disconected. " << ec.message() << std::endl;
					clients.erase(client_socket);
				}
			});
		using namespace std::chrono_literals;
		//std::this_thread::sleep_for(2000ms);
	}

	void broadcast_message(std::string& msg, std::shared_ptr<tcp::socket> sender) {
		std::lock_guard<std::mutex> lock(clients_mutex);  // Блокировка при рассылке
		for (auto& client : clients) {
			if (client != sender) {
				asio::async_write(*client, asio::buffer(msg),
					[client](std::error_code ec, std::size_t /*length*/) {
					if (ec) {
						std::cerr << "Error at broadcast_message: " << ec.message() << std::endl;
					}
				});
			}
			using namespace std::chrono_literals;
			std::this_thread::sleep_for(2000ms);
		}
	}

	asio::io_context io_context_;
	asio::io_context::work idle_work_;
	tcp::acceptor acceptor_;
	std::set<std::shared_ptr<tcp::socket>>clients_;
	std::mutex clients_mutex;  // Мьютекс для защиты clients
};


int main() {
	std::locale::global(std::locale(""));
	try {
		ChatServer server(12345);
		server.run();
	} catch (std::exception& e) {
		std::cerr << "Error: " << e.what() << std::endl;;
	}
}