# C++ 知识点大纲（零基础 → 就业）

> 当前网站只覆盖了第一阶段"基础入门"的 8 章。以下是补齐后的完整体系。

---

## 第一阶段：基础入门 ✅（已有，但后续要优化整理）
- 1.1 C++初识（编译流程、IDE、第一个程序）
- 1.2 数据类型、运算符、流程控制
- 1.3 数组、函数、指针、结构体

---

## 第二阶段：面向对象编程（OOP）🚧
- 2.1 类和对象（封装、访问权限 public/protected/private）
- 2.2 构造函数与析构函数（默认、带参、拷贝、移动构造函数）
- 2.3 初始化列表与 this 指针
- 2.4 静态成员（static 变量/函数）
- 2.5 友元（friend 函数/类/成员函数）
- 2.6 运算符重载（<<、>>、++、=、[]、() 等）
- 2.7 继承（单继承、多继承、菱形继承、虚继承）
- 2.8 多态（虚函数、纯虚函数、抽象类、虚析构）
- 2.9 类型转换（static_cast、dynamic_cast、const_cast、reinterpret_cast）
- 2.10 内部类与局部类

---

## 第三阶段：C++ 核心进阶 🚧
- 3.1 模板编程（函数模板、类模板、特化、偏特化）
- 3.2 异常处理（try/catch/throw、异常安全、noexcept）
- 3.3 命名空间（namespace、匿名空间、ADL）
- 3.4 字符串处理（std::string 深入、编码问题）
- 3.5 输入输出流（iostream、文件流、字符串流）
- 3.6 动态内存管理（new/delete、new[]/delete[]、定位 new）
- 3.7 RAII 与资源管理（核心思想、应用场景）

---

## 第四阶段：STL 标准模板库 🚧
- 4.1 STL 六大组件概览（容器、迭代器、算法、仿函数、适配器、空间配置器）
- 4.2 顺序容器（vector、deque、list、forward_list、array）
- 4.3 关联容器（set/multiset、map/multimap）
- 4.4 无序容器（unordered_set、unordered_map）
- 4.5 容器适配器（stack、queue、priority_queue）
- 4.6 迭代器（输入/输出/前向/双向/随机访问迭代器）
- 4.7 常用算法（sort、find、binary_search、copy、transform、accumulate...）
- 4.8 仿函数（Function Object）与适配器
- 4.9 string 和 regex 库

---

## 第五阶段：现代 C++（C++11/14/17/20/23）🚧
- 5.1 类型推导（auto、decltype、decltype(auto)）
- 5.2 右值引用与移动语义（std::move、std::forward、完美转发）
- 5.3 智能指针（unique_ptr、shared_ptr、weak_ptr、循环引用解决）
- 5.4 Lambda 表达式（捕获列表、泛型 Lambda、捕获 *this）
- 5.5 范围 for 循环与结构化绑定
- 5.6 nullptr、constexpr、if constexpr
- 5.7 std::optional、std::variant、std::any
- 5.8 折叠表达式与变参模板
- 5.9 C++17 文件系统（std::filesystem）
- 5.10 C++20：概念（Concepts）、范围（Ranges）、协程（Coroutines）、模块（Modules）
- 5.11 C++23：std::expected、print、flat_map 等

---

## 第六阶段：实战数据结构与算法 🚧
- 6.1 时间复杂度与空间复杂度分析（大 O）
- 6.2 常用数据结构实现（手写 vector、list、map、unordered_map）
- 6.3 排序算法（快排、归并、堆排、计数排序、基数排序）
- 6.4 搜索算法（二分、BFS、DFS、回溯）
- 6.5 树与图（二叉树、AVL、红黑树、最小生成树、最短路径）
- 6.6 动态规划与贪心算法（LeetCode 高频类型）
- 6.7 字符串匹配（KMP、Rabin-Karp、Trie）

---

## 第七阶段：文件 I/O 与序列化 🚧
- 7.1 C 风格文件操作（fopen/fread/fwrite）
- 7.2 C++ 文件流（ifstream/ofstream、二进制读写）
- 7.3 JSON 解析（nlohmann/json 库）
- 7.4 XML/INI/CSV 解析基础
- 7.5 序列化与反序列化设计

---

## 第八阶段：多线程与并发编程 🚧
- 8.1 线程基础（std::thread、join/detach、jthread）
- 8.2 互斥锁（std::mutex、lock_guard、unique_lock、scoped_lock）
- 8.3 条件变量（std::condition_variable）
- 8.4 原子操作（std::atomic、CAS、内存序）
- 8.5 异步编程（std::future、std::promise、std::async、std::packaged_task）
- 8.6 线程池设计与实现
- 8.7 死锁与活锁：原因、检测、预防
- 8.8 读写锁与共享锁

---

## 第九阶段：网络编程 🚧
- 9.1 计算机网络基础（TCP/IP 协议栈、OSI 七层模型）
- 9.2 Socket API 详解（socket、bind、listen、accept、connect）
- 9.3 TCP 客户端/服务器编程（select、poll、epoll/IOCP）
- 9.4 UDP 编程
- 9.5 HTTP 协议与 RESTful API（cpr 或 curl 封装）
- 9.6 WebSocket 基础
- 9.7 网络库实战：Boost.Asio 或 C++20 协程网络

---

## 第十阶段：设计模式与架构 🚧
- 10.1 面向对象设计原则（SOLID）
- 10.2 创建型模式（单例、工厂、抽象工厂、建造者、原型）
- 10.3 结构型模式（适配器、桥接、组合、装饰、外观、代理、享元）
- 10.4 行为型模式（策略、观察者、责任链、命令、迭代器、访问者）
- 10.5 性能设计模式（对象池、数据局部性、Flyweight）
- 10.6 架构设计（分层架构、事件驱动、ECS、插件化）

---

## 第十一阶段：工程化与工具链 🚧
- 11.1 CMake（现代 CMake、targets、FetchContent、CPack）
- 11.2 包管理器（vcpkg、Conan）
- 11.3 版本控制（Git 进阶：rebase、cherry-pick、submodule）
- 11.4 单元测试（Google Test、Catch2）
- 11.5 性能分析（perf、Valgrind、AddressSanitizer、VTune）
- 11.6 代码静态分析（clang-tidy、cppcheck）
- 11.7 CI/CD 集成（GitHub Actions、GitLab CI）
- 11.8 文档生成（Doxygen）

---

## 第十二阶段：面试与就业特训 🚧
- 12.1 C++ 高频面试题（虚函数表、内存布局、RAII、智能指针...）
- 12.2 LeetCode 高频 100 题 C++ 解法
- 12.3 手撕代码（实现 string、vector、shared_ptr、线程池）
- 12.4 系统设计面试基础
- 12.5 简历项目指导（推荐项目方向）

---

### 就业方向分支

```
          C++ 全栈学习路径（12 阶段）
               │
      ┌────────┼────────┬────────┬────────┐
      ▼        ▼        ▼        ▼        ▼
   游戏开发   后端    量化/金融   嵌入式   音视频
   Unreal    HTTP服务  低延迟     ARM      FFmpeg
   引擎      数据库    算法交易   驱动     WebRTC
```

---

## 总览

| 阶段 | 内容 | 前置要求 |
|------|------|----------|
| 1 | 基础入门 | 零基础 |
| 2 | OOP | 阶段 1 |
| 3 | 核心进阶 | 阶段 2 |
| 4 | STL | 阶段 3 |
| 5 | 现代 C++ | 阶段 3-4 |
| 6 | 数据结构算法 | 阶段 1-2 |
| 7 | 文件 I/O | 阶段 3 |
| 8 | 多线程 | 阶段 3-5 |
| 9 | 网络编程 | 阶段 3-5, 8 |
| 10 | 设计模式 | 阶段 2-4 |
| 11 | 工程化 | 阶段 1-10 |
| 12 | 面试就业 | 全部 |

**预计学习周期：6-12 个月（每天 2-4 小时，有编程基础）**
