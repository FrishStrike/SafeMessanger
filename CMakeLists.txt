cmake_minimum_required(VERSION 3.8)

project(SafeMessanger)

#add_executable(server src/server.cpp "NetCommon/net_message.h" "NetCommon/net_common.h" "NetCommon/net_tsqueue.h" "NetCommon/net_connection.h" "NetCommon/net_client.h" "NetCommon/net_server.h" "another_src/server.cpp")
#target_include_directories(server PRIVATE D:\\cppLib\\asio-1.30.2\\include)

#add_executable(client src/client.cpp "NetCommon/net_message.h" "NetCommon/net_common.h" "NetCommon/net_tsqueue.h" "NetCommon/net_connection.h" "NetCommon/net_client.h" "NetCommon/net_server.h" "another_src/server.cpp")
#target_include_directories(client PRIVATE D:\\cppLib\\asio-1.30.2\\include)
add_executable(server src/server.cpp)
add_executable(client src/client.cpp)
