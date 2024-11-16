#include <iostream>
#include <asio.hpp>
#include <thread>
#include <memory>
#include <locale>

using asio::ip::tcp;

class ChatClient {
public:
    ChatClient(const std::string& host, const std::string& port)
        : socket_(io_context_) {
        tcp::resolver resolver(io_context_);
        auto endpoint = resolver.resolve(host, port);
        asio::connect(socket_, endpoint);
        buffer = std::make_shared<std::array<char, 1024>>();
        start_reading();
    }

    void send_message(const std::string& msg) {
        asio::async_write(socket_, asio::buffer(msg), [this](std::error_code ec, std::size_t /*length*/) {
            if (ec) {
                std::cerr << "Error sending message: " << ec.message() << std::endl;
            }
            });
    }

    void run() {
        io_context_.run();
    }

private:
    void start_reading() {
        socket_.async_read_some(asio::buffer(*buffer),
            [this](std::error_code ec, std::size_t length) {
                if (!ec) {
                    if (length > 0) {
                        std::cout << "Recieved: " << std::string(buffer->data(), length) << std::endl;
                        start_reading();
                    }
                }
                else {
                    std::cerr << "Error reading message: " << ec.message() << std::endl;
                }
            });
    }

    asio::io_context io_context_;
    tcp::socket socket_;
    std::shared_ptr<std::array<char, 1024>> buffer;
};

int main() {
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
