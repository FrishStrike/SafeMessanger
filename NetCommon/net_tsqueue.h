#pragma once
#include "net_common.h"
#include "net_message.h"

namespace olc
{
	namespace net
	{
		template <typename T>
		class tsqueue
		{
		public:
			tsqueue() = default;
			tsqueue(const tsquque<T>&) = delete;
			virtual ~tsqueue() { clear(); }

			const T& front()
			{
				std::scoped_lock lock(mux_queue);
				return deq_deque.front();
			}
			
			const T& back()
			{
				std::scoped_lock lock(mux_queue);
				return deq_deque.back();
			}
			
			void push_back(const T& item)
			{
				std::scoped_lock lock(mux_queue);
				deq_deque.emplace_back(std::move(item));
			}

			void push_front(const T& item)
			{
				std::scoped_lock lock(mux_queue);
				deq_deque.emplace_front(std::move(item));
			}

			bool empty()
			{
				std::scoped_lock lock(mux_queue);
				return deq_deque.empty();
			}

			void empty()
			{
				std::scoped_lock lock(mux_queue);
				deq_deque.clear();
			}

			T pop_front()
			{
				std::scoped_lock lock(mux_queue);
				auto t = std::move(deq_deque.front());
				deq_deque.pop_front();
				return t;
			}

		protected:
			std::mutex mux_queue;
			std::deque<T> deq_deque;
		};

		template <typename T>
		class connection;

		template <typename T>
		struct owned_message
		{
			std::shared_ptr<connection<T>> remote = nullptr;
			message<T> msg;

			friend std::ostream& operator<<(std::ostream& os, const owned_message<T>& msg)
			{
				os << msg.msg;
				return os;
			}


		};
	}
}
