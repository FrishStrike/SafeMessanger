#include <iostream>
#include <asio.hpp>
#include <thread>
#include <memory>
#include <locale>
#include <mutex>

using asio::ip::tcp;

class ChatClient {
public:
	ChatClient(const std::string& host, const std::string& port) 
		: socket_(io_context_), idle_work_(io_context_) {
		tcp::resolver resolver(io_context_);
		auto endpoint = resolver.resolve(host, port);
		asio::connect(socket_, endpoint);
		
		start_reading();
	}

	void send_message(std::string& msg) {
		std::lock_guard<std::mutex> lock(socket_mutex);  // Блокируем сокет для отправки
		try {
			using namespace std::chrono_literals;
			asio::async_write(socket_, asio::buffer(msg), [this](std::error_code ec, std::size_t /*length*/)
				{
					if (ec) {
						std::cerr << "Error sending message: " << ec.message() << std::endl;
					}
			});
			
			std::this_thread::sleep_for(2000ms);
		}
		catch (const std::exception& e) {
			std::cout << "Error with send: " << e.what();
		}
	}

	void run() {
		io_context_.run();
	}

private:
	void start_reading() {
		//auto buffer = new std::array<char, 1024>;
		auto buffer = std::make_shared<std::array<char, 1024>>();
		socket_.async_read_some(asio::buffer(*buffer, sizeof(char) * 1024),
			[this, buffer](std::error_code ec, std::size_t length) {
				if (!ec) {
					if (length > 0) {

						std::string message(buffer->data(), length);
						std::cout << "Recieved: " << message << std::endl;
						start_reading();
					}
				}
				else {
					std::cerr << "Error reading message: " << ec.message() << std::endl;
				}
			});
		using namespace std::chrono_literals;
		//std::this_thread::sleep_for(2000ms);
	}

	asio::io_context io_context_;
	asio::io_context::work idle_work_;
	tcp::socket socket_;
	std::mutex socket_mutex;  // Мьютекс для защиты сокета и буфера
};

int main()
{
	std::locale::global(std::locale(""));
	try {
		ChatClient client("127.0.0.1", "12345");
		std::thread t([&client]() { client.run(); });

		std::string msg;
		while (std::getline(std::cin, msg)) {
			client.send_message(msg);
		}

		t.join();
	}
	catch (std::exception& err) {
		std::cerr << "Exception: " << err.what() << std::endl;
	}	
}