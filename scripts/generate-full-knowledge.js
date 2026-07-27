/**
 * 生成完整 C++ 知识库（12 阶段，面向就业）
 * 运行: node scripts/generate-full-knowledge.js
 * 输出: backend/data/knowledge.json
 */

const fs = require('fs');
const path = require('path');

// ============ 工具函数 ============
function code(lang, src) {
  return `\`\`\`${lang}\n${src}\n\`\`\``;
}

function cpp(src) { return code('cpp', src); }

// ============ 所有阶段数据 ============
const STAGES = [];

// ============================================================
// 第 1 阶段：基础入门（从原始文件保留，这里做补充整理）
// ============================================================
STAGES.push({
  id: 'stage-1-basics',
  title: '第一阶段：基础入门',
  subsections: [
    {
      id: '1-1-first-program',
      title: '1.1 C++ 初识与环境搭建',
      content: `## 什么是 C++

C++ 是一种**编译型、静态类型**的编程语言，由 Bjarne Stroustrup 在 1979 年于贝尔实验室开发。它兼具**高性能**和**抽象能力**，是游戏引擎、操作系统、数据库、量化交易系统的核心语言。

## 编译流程

C++ 源代码需要经过编译才能运行：

1. **预处理**（Preprocessing）— 处理 \`#include\`、\`#define\` 等指令
2. **编译**（Compilation）— 将源码转为汇编/目标文件 (.obj/.o)
3. **链接**（Linking）— 将目标文件和库文件合并为可执行文件

## 第一个程序

${cpp(`#include <iostream>

int main() {
    std::cout << "Hello, C++!" << std::endl;
    return 0;
}`)}

## 常用 IDE 与编译器

- **编译器**：GCC (g++)、Clang、MSVC (Visual Studio)
- **IDE**：Visual Studio、CLion、VS Code + 插件
- **编译命令**：\`g++ main.cpp -o main && ./main\`

## 注释

${cpp(`// 单行注释

/*
  多行注释
  可以跨行
*/

/**
 * Javadoc 风格注释
 * 用于生成文档
 */`)}`,
      code_examples: ['#include <iostream>\n\nint main() {\n    std::cout << "Hello, C++!" << std::endl;\n    return 0;\n}']
    },
    {
      id: '1-2-variables-types',
      title: '1.2 变量与数据类型',
      content: `## 基本数据类型

| 类型 | 大小 | 范围 |
|------|------|------|
| bool | 1 字节 | true / false |
| char | 1 字节 | -128 ~ 127 |
| int | 4 字节 | -2^31 ~ 2^31-1 |
| float | 4 字节 | 约 7 位有效数字 |
| double | 8 字节 | 约 15 位有效数字 |
| void | - | 无类型 |

## 变量定义与初始化

${cpp(`int a;           // 默认初始化（局部变量为未定义值）
int b = 10;      // 拷贝初始化
int c(10);       // 直接初始化
int d{10};       // 列表初始化（C++11 推荐）
int e = {};      // 值初始化（e = 0）`)}

## 常量

${cpp(`const int MAX = 100;        // const 常量（运行时）
constexpr int MIN = 0;       // constexpr 常量（编译时，C++11）
#define PI 3.14159           // 宏常量（预处理，不推荐）`)}

## 类型转换

${cpp(`int a = 10;
double b = a;                  // 隐式转换
double c = (double)a;          // C 风格转换
double d = static_cast<double>(a); // C++ 风格转换（推荐）`)}

**关键要点：**
- 局部变量不会自动初始化，使用前必须赋值
- \`sizeof\` 运算符可查看类型占用字节数
- C++11 起推荐使用列表初始化 \`{}\`，防止窄化转换`,
      code_examples: ['int a = 10;\ndouble b = static_cast<double>(a);\nconst int MAX = 100;']
    },
    {
      id: '1-3-operators',
      title: '1.3 运算符与流程控制',
      content: `## 运算符分类

| 类别 | 运算符 |
|------|--------|
| 算术 | \`+ - * / %\` |
| 赋值 | \`= += -= *= /= %=\` |
| 比较 | \`== != < > <= >=\` |
| 逻辑 | \`&& || !\` |
| 位运算 | \`& | ^ ~ << >>\` |
| 递增递减 | \`++ --\`（前置/后置区别） |

## 流程控制

${cpp(`// 条件分支
if (score >= 90) {
    std::cout << "A";
} else if (score >= 60) {
    std::cout << "B";
} else {
    std::cout << "C";
}

// switch 语句（必须加 break，否则会穿透）
switch (day) {
    case 1: std::cout << "周一"; break;
    case 2: std::cout << "周二"; break;
    default: std::cout << "其它"; break;
}

// 循环
for (int i = 0; i < 10; i++) { /* ... */ }

while (condition) { /* ... */ }

do { /* ... */ } while (condition);`)}

## 三目运算符

${cpp(`int max = (a > b) ? a : b;`)}

**常见陷阱：**
- 浮点数不要直接用 \`==\` 比较，用 \`abs(a - b) < 1e-6\`
- switch 的 case 穿透有时是故意设计的（如多个 case 执行相同代码）`,
      code_examples: ['int max = (a > b) ? a : b;\nfor (int i = 0; i < 10; i++) { }\nif (x > 0 && x < 100) { }']
    },
    {
      id: '1-4-arrays-functions',
      title: '1.4 数组与函数',
      content: `## 数组

${cpp(`// 一维数组
int arr[5] = {1, 2, 3, 4, 5};
int arr2[] = {1, 2, 3};  // 自动推导大小
int n = sizeof(arr) / sizeof(arr[0]);  // 元素个数

// 二维数组
int matrix[3][4] = {
    {1, 2, 3, 4},
    {5, 6, 7, 8},
    {9, 10, 11, 12}
};`)}

## 函数

${cpp(`// 函数声明（原型）
int add(int a, int b);

// 函数定义
int add(int a, int b) {
    return a + b;
}

// 默认参数（从右向左提供默认值）
void print(int x, int y = 10, int z = 20);

// 函数重载（名称相同，参数不同）
int max(int a, int b);
double max(double a, double b);`)}

## 值传递 vs 引用传递

${cpp(`void swap_val(int a, int b) {   // 值传递——不改变实参
    int t = a; a = b; b = t;
}

void swap_ref(int &a, int &b) {  // 引用传递——改变实参
    int t = a; a = b; b = t;
}

void swap_ptr(int *a, int *b) {  // 指针传递——改变实参
    int t = *a; *a = *b; *b = t;
}`)}`,
      code_examples: ['int arr[5] = {1, 2, 3, 4, 5};\nint add(int a, int b) { return a + b; }\nvoid swap(int &a, int &b) { int t = a; a = b; b = t; }']
    },
    {
      id: '1-5-pointers',
      title: '1.5 指针深入理解',
      content: `## 指针基础

指针存储的是另一个变量的**内存地址**。

${cpp(`int a = 10;
int *p = &a;   // p 存储 a 的地址
*p = 20;       // 解引用，修改 a 的值为 20

// 指针的大小（64 位系统固定为 8 字节）
std::cout << sizeof(int*) << std::endl;  // 8`)}

## const 修饰指针（高频面试点）

${cpp(`const int *p = &a;   // 常量指针：指向的内容不可改，但指针可以改指
int *const p = &a;   // 指针常量：指针不可改指，但指向的内容可改
const int *const p = &a; // 两者都不可改`)}

## 指针与数组

${cpp(`int arr[5] = {10, 20, 30, 40, 50};
int *p = arr;       // 数组名就是首元素地址
p++;                // 指向下一个元素（地址 +4）
std::cout << *p;    // 20

// 指针遍历
for (int *p = arr; p < arr + 5; p++) {
    std::cout << *p << " ";
}`)}

## 空指针与野指针

- **空指针**：\`int *p = nullptr;\` — 指向空地址，解引用会崩溃
- **野指针**：指针指向已释放的内存或未初始化的内存，是 C++ 最难调试的 Bug 之一

**核心原则：** 指针必须指向有效内存才能解引用。`,
      code_examples: ['int a = 10;\nint *p = &a;\n*p = 20;\nconst int *cp = &a;']
    },
    {
      id: '1-6-structs',
      title: '1.6 结构体与自定义类型',
      content: `## 结构体

结构体是将不同类型的数据组合成一个新的类型。

${cpp(`struct Student {
    std::string name;
    int age;
    float score;
};

// 使用
Student s1;
s1.name = "张三";
s1.age = 20;

Student s2 = {"李四", 22, 95.5};   // 聚合初始化
Student *p = &s2;
p->age = 23;  // 指针访问成员`)}

## 结构体对齐与填充

结构体的大小不是成员大小的简单相加，因为编译器会在成员之间插入**填充字节**以满足对齐要求。

${cpp(`struct A {       // 实际大小：8
    char a;      // 1 字节 + 3 填充
    int b;       // 4 字节
};

struct B {       // 实际大小：12
    char a;      // 1 字节 + 3 填充
    double b;    // 8 字节
};`)}

## typedef 与 using

${cpp(`typedef unsigned long ulong;        // 传统方式
using ulong = unsigned long;          // C++11 推荐（更直观）

using StringList = std::vector<std::string>;  // 模板别名`)}`,
      code_examples: ['struct Student { string name; int age; };\nStudent s = {"张三", 20};']
    },
  ]
});

// ============================================================
// 第 2 阶段：面向对象编程
// ============================================================
STAGES.push({
  id: 'stage-2-oop',
  title: '第二阶段：面向对象编程',
  subsections: [
    {
      id: '2-1-class-basics',
      title: '2.1 类与对象、封装',
      content: `## 类的基本概念

类是 C++ 面向对象编程的核心，它将**数据**和**操作数据的方法**封装在一起。

${cpp(`class Rectangle {
private:    // 私有成员——外部不可访问
    double width_;
    double height_;

public:     // 公有接口——外部可访问
    Rectangle(double w, double h) : width_(w), height_(h) {}

    double area() const {
        return width_ * height_;
    }

    void resize(double factor) {
        width_ *= factor;
        height_ *= factor;
    }
};

// 使用
Rectangle r(10, 20);
std::cout << r.area();  // 200
r.resize(1.5);`)}

## 访问权限

| 关键字 | 同一类 | 派生类 | 外部 |
|--------|--------|--------|------|
| public | ✅ | ✅ | ✅ |
| protected | ✅ | ✅ | ❌ |
| private | ✅ | ❌ | ❌ |

## struct vs class

- C++ 中 \`struct\` 和 \`class\` **几乎一样**
- 唯一区别：默认访问权限不同
  - \`struct\`：默认 public
  - \`class\`：默认 private

**封装的好处：**
1. 隐藏实现细节，只暴露接口
2. 保证数据的完整性（通过 setter 校验）
3. 降低耦合，便于修改维护`,
      code_examples: ['class Rectangle {\nprivate:\n    double w_, h_;\npublic:\n    double area() const { return w_ * h_; }\n};']
    },
    {
      id: '2-2-constructor-destructor',
      title: '2.2 构造函数与析构函数',
      content: `## 构造函数

构造函数在**对象创建时自动调用**，用于初始化对象。

${cpp(`class Student {
private:
    std::string name_;
    int age_;
    int *scores_;

public:
    // 默认构造函数
    Student() : name_("未知"), age_(0), scores_(nullptr) {}

    // 带参构造函数
    Student(const std::string &name, int age)
        : name_(name), age_(age), scores_(nullptr) {}

    // 拷贝构造函数——从另一个对象构造
    Student(const Student &other)
        : name_(other.name_), age_(other.age_) {
        if (other.scores_) {
            scores_ = new int[100];
            memcpy(scores_, other.scores_, 100 * sizeof(int));
        }
    }

    // 移动构造函数（C++11）
    Student(Student &&other) noexcept
        : name_(std::move(other.name_))
        , age_(other.age_)
        , scores_(other.scores_) {
        other.scores_ = nullptr;  // 资源转移后置空
    }

    // 析构函数——对象销毁时自动调用
    ~Student() {
        delete[] scores_;  // 释放动态内存
    }
};`)}

## 初始化列表

初始化列表在构造函数体**之前**执行，用于初始化成员变量。

${cpp(`class Example {
private:
    const int const_val_;  // const 成员必须用初始化列表
    int &ref_;             // 引用成员必须用初始化列表
public:
    Example(int v, int &r)
        : const_val_(v), ref_(r) {  // 初始化列表
        // 构造函数体
    }
};`)}

## 委托构造函数

${cpp(`class Clock {
    int h_, m_, s_;
public:
    Clock() : Clock(0, 0, 0) {}        // 委托给三参构造函数
    Clock(int h) : Clock(h, 0, 0) {}
    Clock(int h, int m, int s) : h_(h), m_(m), s_(s) {}
};`)}

## 三/五法则（Rule of Three/Five）

如果类管理了动态资源（如 \`new\` 分配的内存），那么：

> **需要自定义析构函数 → 几乎一定需要自定义拷贝构造和拷贝赋值**

C++11 起扩展到五：析构、拷贝构造、拷贝赋值、移动构造、移动赋值`,
      code_examples: ['Student(const Student &other) : name_(other.name_) { /* 深拷贝 */ }\n~Student() { delete[] scores_; }']
    },
    {
      id: '2-3-this-static-friend',
      title: '2.3 this 指针、静态成员与友元',
      content: `## this 指针

每个成员函数都有一个隐含的 \`this\` 指针，指向调用该函数的对象本身。

${cpp(`class Point {
    int x_, y_;
public:
    Point &setX(int x) {
        this->x_ = x;   // this->x_ 区分成员变量和参数
        return *this;   // 返回引用支持链式调用
    }
    Point &setY(int y) {
        this->y_ = y;
        return *this;
    }
};

// 链式调用
Point p;
p.setX(10).setY(20);`)}

## 静态成员

静态成员属于**类本身**，而不是某个对象，所有对象共享一份。

${cpp(`class BankAccount {
private:
    static double interest_rate_;  // 静态成员变量声明
    static int total_accounts_;    // 统计总账号数
    double balance_;

public:
    BankAccount() { total_accounts_++; }
    ~BankAccount() { total_accounts_--; }

    static double getRate() { return interest_rate_; }  // 静态成员函数
    static int count() { return total_accounts_; }
};

// 静态成员变量必须在类外定义并初始化
double BankAccount::interest_rate_ = 0.035;
int BankAccount::total_accounts_ = 0;`)}

## 友元

友元函数或类可以访问另一个类的私有成员。

${cpp(`class Matrix;

class Vector {
    double data_[3];
public:
    friend class Matrix;           // Matrix 可以访问 Vector 的私有成员
    friend double dot(const Vector &a, const Vector &b);  // 友元函数
};`)}

**友元的争议：** 友元破坏了封装性，但在运算符重载和某些设计模式中不可或缺。`,
      code_examples: ['class Point {\npublic:\n    Point &setX(int x) { x_ = x; return *this; }\n};']
    },
    {
      id: '2-4-operator-overloading',
      title: '2.4 运算符重载',
      content: `## 运算符重载基础

运算符重载让自定义类型像内置类型一样使用运算符。

${cpp(`class Complex {
    double real_, imag_;
public:
    Complex(double r = 0, double i = 0) : real_(r), imag_(i) {}

    // 二元运算符重载（成员函数方式）
    Complex operator+(const Complex &other) const {
        return Complex(real_ + other.real_, imag_ + other.imag_);
    }

    // 复合赋值
    Complex &operator+=(const Complex &other) {
        real_ += other.real_;
        imag_ += other.imag_;
        return *this;
    }

    // 前置 ++
    Complex &operator++() {
        ++real_;
        return *this;
    }

    // 后置 ++（int 参数是标识，无实际意义）
    Complex operator++(int) {
        Complex tmp = *this;
        ++real_;
        return tmp;
    }

    // 输出运算符（必须是非成员函数）
    friend std::ostream &operator<<(std::ostream &os, const Complex &c) {
        return os << c.real_ << " + " << c.imag_ << "i";
    }
};`)}

## 可重载 vs 不可重载

| 可重载 | 不可重载 |
|--------|----------|
| + - * / % | \`.\` 成员访问 |
| == != < > | \`::\` 作用域解析 |
| = [] () -> | \`?:\` 三目 |
| ++ -- | \`sizeof\` |
| << >> | \`.*\` 成员指针访问 |
| & \| ^ ~ | \`#\` \`##\` 预处理器 |

## 下标运算符 []

${cpp(`class IntArray {
    int *data_;
    int size_;
public:
    int &operator[](int idx) {
        if (idx < 0 || idx >= size_) throw std::out_of_range("索引越界");
        return data_[idx];
    }
    const int &operator[](int idx) const {
        if (idx < 0 || idx >= size_) throw std::out_of_range("索引越界");
        return data_[idx];
    }
};`)}

## 函数调用运算符 ()

实现 \`operator()\` 的对象称为**函数对象**或**仿函数**。

${cpp(`class Multiply {
    double factor_;
public:
    Multiply(double f) : factor_(f) {}
    double operator()(double x) const { return x * factor_; }
};

Multiply by2(2.0);
std::cout << by2(3.0);  // 6.0
std::cout << by2(5.0);  // 10.0`)}

**原则：** 重载运算符应保持其**自然语义**，不要滥用。`,
      code_examples: ['Complex operator+(const Complex &a, const Complex &b) { ... }']
    },
    {
      id: '2-5-inheritance',
      title: '2.5 继承',
      content: `## 继承基础

继承让一个类（派生类）获得另一个类（基类）的成员。

${cpp(`class Animal {
protected:
    std::string name_;
public:
    Animal(const std::string &name) : name_(name) {}
    virtual void speak() const { std::cout << "..." << std::endl; }
    virtual ~Animal() = default;
};

class Dog : public Animal {  // 公有继承
public:
    Dog(const std::string &name) : Animal(name) {}
    void speak() const override { std::cout << "汪汪!" << std::endl; }
    void fetch() const { std::cout << name_ << " 在接球" << std::endl; }
};`)}

## 继承方式

| 基类权限 | public 继承 | protected 继承 | private 继承 |
|----------|------------|----------------|--------------|
| public | public | protected | private |
| protected | protected | protected | private |
| private | 不可见 | 不可见 | 不可见 |

## 构造函数与析构顺序

${cpp(`class Base {
public:
    Base() { std::cout << "Base构造\\n"; }
    ~Base() { std::cout << "Base析构\\n"; }
};

class Derived : public Base {
public:
    Derived() { std::cout << "Derived构造\\n"; }
    ~Derived() { std::cout << "Derived析构\\n"; }
};
// 输出:
// Base构造
// Derived构造
// Derived析构
// Base析构`)}

## 菱形继承与虚继承

${cpp(`class Animal { public: int age; };
class Dog : virtual public Animal {};  // 虚继承
class Cat : virtual public Animal {};  // 虚继承
class Monster : public Dog, public Cat {};
// 如果没有虚继承，Monster 会有两份 age，造成二义性

Monster m;
m.age = 5;  // 虚继承后无歧义`)}

**继承 vs 组合：** 优先使用**组合**（has-a），继承（is-a）仅在明确的多态关系中使用。`,
      code_examples: ['class Dog : public Animal {\npublic:\n    void speak() const override { }\n};']
    },
    {
      id: '2-6-polymorphism',
      title: '2.6 多态与虚函数',
      content: `## 虚函数与多态

多态允许通过**基类指针/引用**调用**派生类的函数**。

${cpp(`class Shape {
public:
    virtual double area() const = 0;  // 纯虚函数——抽象类
    virtual ~Shape() = default;       // 基类析构函数应为虚函数
};

class Circle : public Shape {
    double radius_;
public:
    Circle(double r) : radius_(r) {}
    double area() const override { return 3.14159 * radius_ * radius_; }
};

class Rectangle : public Shape {
    double w_, h_;
public:
    Rectangle(double w, double h) : w_(w), h_(h) {}
    double area() const override { return w_ * h_; }
};

// 多态使用
void printArea(const Shape &s) {
    std::cout << "面积: " << s.area() << std::endl;
}

Circle c(5);
Rectangle r(3, 4);
printArea(c);  // 78.5397
printArea(r);  // 12`)}

## 虚函数表（vtable，高频面试）

每个有虚函数的类都有一个**虚函数表**（vtable），其中存储了虚函数的地址。

${cpp(`class Base {
public:
    virtual void f() { cout << "Base::f\\n"; }
    virtual void g() { cout << "Base::g\\n"; }
    virtual ~Base() = default;
};

class Derived : public Base {
public:
    void f() override { cout << "Derived::f\\n"; }  // 覆盖 vtable 中 f 的地址
};

// 对象内存布局（典型实现）:
// [vptr] → [&Derived::f, &Base::g, &Base::~Base]
// [成员变量...]

// 多态的代价：
// - 每个对象多一个 vptr（8 字节）
// - 虚函数调用无法内联（因为调用目标在运行时才能确定）`)}

## override 和 final（C++11）

${cpp(`class Derived : public Base {
    void f() override;   // 明确表示覆盖基类虚函数（编译器会检查签名是否匹配）
};

class Sealed final : public Base {
    // final 类不能被继承
};

virtual void g() final;  // final 虚函数不能被进一步覆盖`)}

## 纯虚函数与抽象类

- 包含**纯虚函数**（\`= 0\`）的类是**抽象类**，不能实例化
- 派生类必须实现所有纯虚函数才能实例化
- 纯虚函数可以有**定义体**（可以调用 Base::func()）`,
      code_examples: ['virtual double area() const = 0;']
    },
    {
      id: '2-7-casting',
      title: '2.7 C++ 类型转换',
      content: `## 四种类型转换运算符

### static_cast — 编译时检查，最常用

${cpp(`double d = 3.14;
int i = static_cast<int>(d);  // 3

Base *base = new Derived();
Derived *derived = static_cast<Derived*>(base);  // 向下转型（不安全）`)}

### dynamic_cast — 运行时检查，用于多态类型

${cpp(`Base *base = new Derived();
if (Derived *d = dynamic_cast<Derived*>(base)) {
    // 转型成功
    d->derivedMethod();
} else {
    // 转型失败
}

Base *base2 = new Base();
Derived *d2 = dynamic_cast<Derived*>(base2);  // nullptr
// 需要 RTTI 支持，有额外开销`)}

### const_cast — 移除 const

${cpp(`const int a = 10;
int *p = const_cast<int*>(&a);
// 写 const 对象是未定义行为，const_cast 更多用于调用老旧 API`)}

### reinterpret_cast — 最危险，位级转换

${cpp(`// 将指针转为整数（硬件相关）
uintptr_t addr = reinterpret_cast<uintptr_t>(ptr);`)}

## 转型建议

1. 优先使用 \`static_cast\`，而不是 C 风格转型
2. 多态向下转型用 \`dynamic_cast\`
3. 避免使用 \`const_cast\` 和 \`reinterpret_cast\`
4. \`static_cast\` 没有运行时开销，\`dynamic_cast\` 有`,
      code_examples: ['double d = 3.14;\nint i = static_cast<int>(d);']
    },
  ]
});

// ============================================================
// 第 3 阶段：C++ 核心进阶
// ============================================================
STAGES.push({
  id: 'stage-3-advanced',
  title: '第三阶段：C++ 核心进阶',
  subsections: [
    {
      id: '3-1-templates',
      title: '3.1 模板编程',
      content: `## 函数模板

模板是 C++ **泛型编程**的基础，允许编写与类型无关的代码。

${cpp(`// 函数模板
template <typename T>
T max(T a, T b) {
    return (a > b) ? a : b;
}

// 使用
int imax = max(3, 7);           // T = int
double dmax = max(3.14, 2.72);  // T = double
// 自动推导类型，也可显式指定：max<double>(3, 2.72)`)}

## 类模板

${cpp(`template <typename T, size_t Size>
class Array {
    T data_[Size];
public:
    T &operator[](size_t idx) { return data_[idx]; }
    const T &operator[](size_t idx) const { return data_[idx]; }
    size_t size() const { return Size; }
};

Array<int, 10> arr;
arr[0] = 42;`)}

## 模板特化

${cpp(`// 主模板
template <typename T>
struct IsPointer { static constexpr bool value = false; };

// 完全特化——针对特定类型的特殊实现
template <>
struct IsPointer<int*> { static constexpr bool value = true; };

// 偏特化（部分特化）——针对某一类类型
template <typename T>
struct IsPointer<T*> { static constexpr bool value = true; };`)}

## 变参模板（C++11）

${cpp(`// 打印任意数量参数
void print() {}  // 递归终止

template <typename T, typename... Args>
void print(T first, Args... rest) {
    std::cout << first << " ";
    print(rest...);  // 递归展开
}

print(1, 2.5, "hello", 'c');  // 1 2.5 hello c`)}

## 模板的编译模型

- 模板的声明和**定义通常都放在头文件**中（不能分离编译）
- 模板在**实例化时**才生成真正的代码
- 模板错误通常在实例化点才被发现

**关键概念：**
- typename 和 class 在模板参数中含义相同
- 模板元编程（TMP）可以在编译期执行计算
- C++20 的 Concepts 对模板参数进行约束`,
      code_examples: ['template <typename T>\nT max(T a, T b) { return (a > b) ? a : b; }']
    },
    {
      id: '3-2-exception',
      title: '3.2 异常处理',
      content: `## 异常基础

异常用于处理程序运行时发生的**错误情况**。

${cpp(`#include <stdexcept>

double divide(double a, double b) {
    if (b == 0) {
        throw std::invalid_argument("除数不能为 0");
    }
    return a / b;
}

try {
    double result = divide(10, 0);
    std::cout << result << std::endl;
} catch (const std::invalid_argument &e) {
    std::cerr << "错误: " << e.what() << std::endl;
} catch (const std::exception &e) {
    std::cerr << "其他异常: " << e.what() << std::endl;
} catch (...) {
    std::cerr << "未知异常" << std::endl;
}`)}

## 异常安全保证

| 级别 | 含义 |
|------|------|
| 无保证 | 异常发生后可能泄漏资源或数据损坏 |
| 基本保证 | 异常发生后资源不泄漏，数据处于有效但不确定的状态 |
| 强保证 | 操作要么完全成功，要么回滚到操作前的状态 |
| noexcept | 保证不会抛出异常 |

## noexcept

${cpp(`// 声明函数不抛异常
void safeFunc() noexcept;

// noexcept 可以作为运算符使用（C++11）
template <typename T>
void func() {
    std::cout << noexcept(T()) << std::endl;  // 检查 T() 是否可能抛异常
}

// 条件式 noexcept（C++17）
template <typename T>
void move(T &a, T &b) noexcept(std::is_nothrow_move_constructible_v<T>);`)}

## RAII 与异常安全

当异常抛出时，栈上对象会被自动销毁（**栈展开**），析构函数会被调用。这是 RAII 配合异常安全的基础。

${cpp(`class FileGuard {
    FILE *fp_;
public:
    FileGuard(const char *name) : fp_(fopen(name, "r")) {
        if (!fp_) throw std::runtime_error("文件打开失败");
    }
    ~FileGuard() { if (fp_) fclose(fp_); }
};

// 即使中间抛出异常，文件也会被正常关闭
void process() {
    FileGuard fg("data.txt");
    // ... 可能抛出异常的代码
}`)}

**最佳实践：**
- 不要在析构函数中抛出异常
- 使用 RAII 管理资源，避免手动 try-catch 清理
- 按 const 引用捕获异常对象`,
      code_examples: ['throw std::invalid_argument("错误");\ntry { } catch (const std::exception &e) { }']
    },
    {
      id: '3-3-strings',
      title: '3.3 字符串处理',
      content: `## std::string 深入

${cpp(`#include <string>

std::string s1 = "Hello";
std::string s2 = "World";

// 常用操作
s1.size();           // 5
s1.length();         // 5（同 size）
s1.empty();          // false
s1[0];               // 'H'
s1.at(0);            // 'H'（带越界检查）

// 拼接
std::string s3 = s1 + " " + s2;  // "Hello World"
s1 += "!";

// 查找
size_t pos = s1.find("World");   // 未找到返回 npos
if (pos != std::string::npos) {  // 判断是否找到
    std::string sub = s1.substr(pos, 5);  // 子串
}

// 转换
int num = std::stoi("42");           // 字符串→整数
double d = std::stod("3.14");        // 字符串→浮点数
std::string s = std::to_string(42);  // 数字→字符串`)}

## 编码问题

${cpp(`// UTF-8 编码（C++11 起支持 u8 前缀）
const char *utf8 = u8"你好，世界";

// 宽字符
std::wstring ws = L"Hello";
std::wcout << ws << std::endl;

// C++17 的 std::string_view——避免拷贝
std::string_view sv = "不拷贝的字符串引用";`)}

**核心对比：**
- C 风格字符串（\`char*\`）：需要手动管理内存，容易出错，C++ 中不推荐
- \`std::string\`：自动管理内存、支持各种操作、C++ 中优先使用
- \`std::string_view\`（C++17）：轻量只读引用，适合函数参数`,
      code_examples: ['std::string s = "Hello";\ns.size();\ns.find("World");']
    },
    {
      id: '3-4-io-stream',
      title: '3.4 输入输出流',
      content: `## iostream 库

C++ 的 I/O 流库提供类型安全的输入输出。

${cpp(`#include <iostream>
#include <iomanip>

// 输出
std::cout << "Hello";               // 标准输出
std::cerr << "错误信息";             // 标准错误（无缓冲）
std::clog << "日志信息";             // 标准日志（有缓冲）

// 输入
int n;
std::cin >> n;                       // 读取整数
std::string line;
std::getline(std::cin, line);        // 读取一行

// 格式化
std::cout << std::fixed << std::setprecision(2);
std::cout << 3.14159;                // 3.14

std::cout << std::hex << 255;        // ff（十六进制输出）
std::cout << std::boolalpha << true; // true（输出 true/false 而非 1/0）`)}

## 文件流

${cpp(`#include <fstream>

// 写文件
std::ofstream ofs("output.txt");
if (!ofs) {
    std::cerr << "文件打开失败" << std::endl;
    return;
}
ofs << "Hello, File!" << std::endl;
ofs.close();

// 读文件
std::ifstream ifs("input.txt");
std::string line;
while (std::getline(ifs, line)) {
    std::cout << line << std::endl;
}

// 二进制读写
std::ofstream bin("data.bin", std::ios::binary);
int data[] = {1, 2, 3, 4, 5};
bin.write(reinterpret_cast<char*>(data), sizeof(data));`)}

## 字符串流

${cpp(`#include <sstream>

std::stringstream ss;
ss << "年龄: " << 25 << ", 分数: " << 92.5;

// 解析字符串
std::string data = "张三 20 95";
std::string name;
int age;
double score;
std::stringstream(data) >> name >> age >> score;`)}

**关键区别：**
- \`cout\` 有缓冲，\`cerr\` 无缓冲（立即输出）
- 文件流对象析构时自动关闭文件，但显式 close 是良好习惯`,
      code_examples: ['std::ofstream ofs("output.txt");\nofs << "Hello";\nofs.close();']
    },
    {
      id: '3-5-memory-management',
      title: '3.5 动态内存管理',
      content: `## 堆与栈

| 特性 | 栈（Stack） | 堆（Heap） |
|------|------------|------------|
| 分配方式 | 自动分配和释放 | 手动分配和释放 |
| 速度 | 极快（移动栈指针） | 较慢（需要查找空闲块） |
| 大小 | 较小（通常 1-8 MB） | 较大（取决于系统内存） |
| 生命周期 | 函数返回时自动释放 | 直到手动释放 |

${cpp(`void func() {
    int a = 10;              // 栈分配
    int *p = new int(20);    // 堆分配
    int *arr = new int[100]; // 堆分配数组
    delete p;                // 释放单个对象
    delete[] arr;            // 释放数组
}`)}

## new/delete 工作原理

${cpp(`// new 的分解动作：
// 1. 调用 operator new(size) 分配内存
// 2. 调用构造函数（如果类型有构造函数）

// delete 的分解动作：
// 1. 调用析构函数
// 2. 调用 operator delete(ptr) 释放内存

// 定位 new（placement new）
char buffer[sizeof(int)];
int *p = new (buffer) int(42);  // 在已有内存上构造对象
p->~int();  // 手动调用析构函数`)}

## 常见内存问题

${cpp(`// 1. 内存泄漏
void leak() {
    int *p = new int(42);
    // 忘记 delete p;
}

// 2. 悬空指针
int *dangling() {
    int a = 42;
    return &a;  // a 是局部变量，函数返回后已销毁
}

// 3. 双重释放
void double_free() {
    int *p = new int(42);
    delete p;
    delete p;  // 未定义行为！
}

// 4. 数组 delete 不匹配
int *arr = new int[10];
delete arr;  // 未定义行为！应该用 delete[]`)}

## RAII——资源获取即初始化

RAII 是 C++ 中最重要的资源管理原则：
- 资源在构造函数中获取
- 资源在析构函数中释放
- 通过栈上对象自动管理堆上资源

**这是智能指针的基础，也是异常安全的关键。**`,
      code_examples: ['int *p = new int(42);\ndelete p;\nint *arr = new int[10];\ndelete[] arr;']
    },
  ]
});

// ============================================================
// 第 4 阶段：STL 标准模板库
// ============================================================
STAGES.push({
  id: 'stage-4-stl',
  title: '第四阶段：STL 标准模板库',
  subsections: [
    {
      id: '4-1-stl-overview',
      title: '4.1 STL 六大组件',
      content: `## STL 六大组件

STL（Standard Template Library）是 C++ 标准库的核心，由六大组件组成：

| 组件 | 作用 | 例子 |
|------|------|------|
| **容器** | 存储数据 | vector, list, map |
| **迭代器** | 遍历容器中的元素 | begin(), end() |
| **算法** | 处理容器中的数据 | sort, find, copy |
| **仿函数** | 自定义算法的行为 | less<T>, greater<T> |
| **适配器** | 修改组件接口 | stack, queue |
| **分配器** | 管理内存分配 | allocator<T> |

## 容器分类

${cpp(`// 序列式容器（线性存储）
std::vector<int> v;      // 动态数组，随机访问 O(1)
std::deque<int> d;       // 双端队列
std::list<int> l;        // 双向链表
std::forward_list<int> f;// 单向链表（C++11）
std::array<int, 5> a;    // 固定大小数组（C++11）

// 关联式容器（自动排序，红黑树实现）
std::set<int> s;         // 唯一键集合
std::multiset<int> ms;   // 允许重复键
std::map<int, int> m;    // 键值对
std::multimap<int, int> mm; // 允许重复键的 map

// 无序关联容器（哈希表，C++11）
std::unordered_set<int> us;
std::unordered_map<int, int> um;`)}

## 选择容器的原则

1. 默认使用 \`vector\`（性能最好，缓存局部性最优）
2. 需要频繁在头部/中间插入删除 → \`list\` 或 \`forward_list\`
3. 需要双端操作 → \`deque\`
4. 需要按键查找 → \`unordered_map\`（平均 O(1)）或 \`map\`（O(log n)）
5. 需要有序数据 → \`set\` / \`map\`
6. 需要保持插入顺序 → \`vector\` 或 \`list\``,
      code_examples: ['#include <vector>\nstd::vector<int> v = {1, 2, 3};']
    },
    {
      id: '4-2-vector',
      title: '4.2 vector 详解',
      content: `## vector 是动态数组

\`std::vector\` 是最常用的 STL 容器，在连续内存中存储元素。

${cpp(`#include <vector>

// 创建和初始化
std::vector<int> v1;                 // 空 vector
std::vector<int> v2(10);             // 10 个默认初始化的元素
std::vector<int> v3(10, 5);          // 10 个值为 5 的元素
std::vector<int> v4 = {1, 2, 3, 4};  // 列表初始化（C++11）

// 常用操作
v.push_back(42);          // 末尾添加元素
v.pop_back();             // 移除末尾元素
v.size();                 // 元素个数
v.capacity();             // 当前容量（预分配空间）
v.reserve(100);           // 预分配容量（避免频繁重新分配）
v.shrink_to_fit();        // 释放多余容量（C++11）
v.clear();                // 清空所有元素
v.empty();                // 是否为空

// 访问
v[0];            // 不检查越界
v.at(0);         // 检查越界（越界时抛 out_of_range）
v.front();       // 第一个元素
v.back();        // 最后一个元素
v.data();        // 返回底层数组指针

// 遍历
for (size_t i = 0; i < v.size(); i++) { /* v[i] */ }
for (int x : v) { /* x */ }
for (auto it = v.begin(); it != v.end(); ++it) { /* *it */ }`)}

## vector 的扩容机制

\`vector\` 在容量不足时会**重新分配**一块更大的内存（通常为当前容量的 1.5~2 倍），将所有元素移动到新内存，然后释放旧的。

${cpp(`std::vector<int> v;
std::cout << v.capacity();   // 0
v.push_back(1);
std::cout << v.capacity();   // 1
v.push_back(2);
std::cout << v.capacity();   // 2
v.push_back(3);
std::cout << v.capacity();   // 4（翻倍扩容）
// 频繁扩容有性能开销，已知大小可提前 reserve()`)}

## 迭代器失效

当 \`vector\` 发生重新分配时，之前获取的所有迭代器、指针和引用都**失效**。
在 \`vector\` 中间插入/删除元素也可能导致迭代器失效。`,
      code_examples: ['std::vector<int> v = {1, 2, 3};\nv.push_back(42);\nfor (int x : v) { }']
    },
    {
      id: '4-3-map-set',
      title: '4.3 map 与 set',
      content: `## map —— 键值对映射

${cpp(`#include <map>

std::map<std::string, int> scores;

// 插入
scores["张三"] = 95;           // 方式一：下标访问（如不存在则创建）
scores.insert({"李四", 88});   // 方式二：insert（C++11）
scores.emplace("王五", 92);    // 方式三：emplace（避免拷贝）

// 查找
if (auto it = scores.find("张三"); it != scores.end()) {
    std::cout << it->first << ": " << it->second;
}

// 遍历
for (const auto &[name, score] : scores) {  // 结构化绑定（C++17）
    std::cout << name << " = " << score << std::endl;
}

// 统计出现次数
std::map<char, int> freq;
for (char c : "hello world") freq[c]++;`)}

## set —— 唯一元素集合

${cpp(`#include <set>

std::set<int> s = {3, 1, 4, 1, 5, 9};  // 自动去重、排序
// 结果: {1, 3, 4, 5, 9}

s.insert(2);
s.erase(1);
if (s.contains(3)) { /* C++20 */ }  // 或 s.count(3) > 0

// set 的迭代器是 const 的（不能修改元素值，因为会破坏排序）`)}

## unordered_map —— 哈希表

${cpp(`#include <unordered_map>

// 平均 O(1) 的查找，但不保证有序
std::unordered_map<std::string, int> um;
um["apple"] = 5;
um["banana"] = 3;

// 自定义哈希（用于自定义类型）
struct Person { string name; int age; };
struct PersonHash {
    size_t operator()(const Person &p) const {
        return hash<string>()(p.name) ^ hash<int>()(p.age);
    }
};
std::unordered_map<Person, int, PersonHash> um2;`)}

**性能对比：**

| 容器 | 插入 | 查找 | 删除 | 有序 |
|------|------|------|------|------|
| map | O(log n) | O(log n) | O(log n) | ✅ |
| unordered_map | O(1) 均摊 | O(1) | O(1) | ❌ |
| set | O(log n) | O(log n) | O(log n) | ✅ |
| unordered_set | O(1) 均摊 | O(1) | O(1) | ❌ |`,
      code_examples: ['std::map<string, int> m;\nm["key"] = 42;\nfor (auto &[k, v] : m) { }']
    },
    {
      id: '4-4-algorithms',
      title: '4.4 STL 算法',
      content: `## 算法分类

STL 提供了上百种算法，分为以下几类：

${cpp(`#include <algorithm>
#include <numeric>

std::vector<int> v = {4, 2, 5, 1, 3};

// 1. 排序
std::sort(v.begin(), v.end());          // 快速排序 O(n log n)
std::stable_sort(v.begin(), v.end());   // 稳定排序
std::partial_sort(v.begin(), v.begin()+3, v.end());  // 部分排序
std::nth_element(v.begin(), v.begin()+v.size()/2, v.end());  // 第 n 大

// 2. 查找
auto it = std::find(v.begin(), v.end(), 3);
auto it2 = std::binary_search(v.begin(), v.end(), 3);  // 要求已排序
auto [first, last] = std::equal_range(v.begin(), v.end(), 3);  // 范围

// 3. 修改
std::fill(v.begin(), v.end(), 0);        // 填充
std::copy(src.begin(), src.end(), dst.begin());  // 拷贝
std::transform(v.begin(), v.end(), v.begin(),
               [](int x) { return x * 2; });     // 转换

// 4. 删除（需要配合 erase）
std::erase(v, 3);                         // C++20 直接删除
auto new_end = std::remove(v.begin(), v.end(), 3);  // 移到末尾
v.erase(new_end, v.end());                // 真正删除

// 5. 数值算法
int sum = std::accumulate(v.begin(), v.end(), 0);
int product = std::accumulate(v.begin(), v.end(), 1, std::multiplies<int>());
std::vector<int> diff;
std::adjacent_difference(v.begin(), v.end(), std::back_inserter(diff));`)}

## Lambda 表达式与算法

STL 算法与 Lambda 表达式配合是 C++ 最常见的编程模式之一。

${cpp(`std::vector<Student> students = {...};

// 按分数排序
std::sort(students.begin(), students.end(),
    [](const Student &a, const Student &b) {
        return a.score > b.score;  // 降序
    });

// 条件查找
auto it = std::find_if(students.begin(), students.end(),
    [](const Student &s) { return s.score >= 90; });

// 条件统计
int count = std::count_if(students.begin(), students.end(),
    [](const Student &s) { return s.age < 18; });

// 过滤
std::erase_if(students,
    [](const Student &s) { return s.score < 60; });  // C++20`)}

## 算法复杂度（面试常问）

| 算法 | 复杂度 |
|------|--------|
| sort | O(n log n) |
| nth_element | O(n) |
| find / find_if | O(n) |
| binary_search | O(log n) — 要求已排序 |
| lower_bound / upper_bound | O(log n) |
| set_union / set_intersection | O(n) — 要求已排序 |`,
      code_examples: ['std::sort(v.begin(), v.end());\nstd::find(v.begin(), v.end(), 3);']
    },
    {
      id: '4-5-iterators',
      title: '4.5 迭代器',
      content: `## 迭代器分类

迭代器是连接容器和算法的**桥梁**，每个容器提供自己的迭代器类型。

| 迭代器类别 | 功能 | 示例 |
|-----------|------|------|
| 输入迭代器 | 只读，单向遍历 | istream_iterator |
| 输出迭代器 | 只写，单向遍历 | ostream_iterator |
| 前向迭代器 | 读写，单向，可重复遍历 | forward_list |
| 双向迭代器 | 读写，双向遍历 | list, set, map |
| 随机访问迭代器 | 读写，支持随机访问 | vector, deque, array |

${cpp(`std::vector<int> v = {10, 20, 30, 40, 50};

// 正向遍历
auto it = v.begin();
std::cout << *it;          // 10
++it;                      // 指向 20
it += 2;                   // 指向 40（仅随机访问迭代器）
std::cout << *(it - 1);    // 30
std::cout << it[0];        // 40

// 反向遍历
for (auto rit = v.rbegin(); rit != v.rend(); ++rit) {
    std::cout << *rit;     // 50, 40, 30, 20, 10
}

// 常量迭代器（不能修改元素）
auto cit = v.cbegin();
// *cit = 100;  // 编译错误`)}

## 迭代器适配器

${cpp(`#include <iterator>

// 插入迭代器——在容器中插入而非覆盖
std::vector<int> dest;
std::copy(src.begin(), src.end(), std::back_inserter(dest));
// dest 会自动增长

std::vector<int> v = {1, 2, 3};
auto it = std::inserter(v, v.begin() + 1);
*it = 99;   // v = {1, 99, 2, 3}

// 流迭代器
std::istream_iterator<int> cin_it(std::cin), end;
std::vector<int> input(cin_it, end);  // 从标准输入读整数直到 EOF

std::ostream_iterator<int> out_it(std::cout, ", ");
std::copy(v.begin(), v.end(), out_it);  // 输出: 1, 99, 2, 3,`)}

## 迭代器失效（重要！）

在容器操作后，之前的迭代器可能失效：

| 操作 | vector/deque | list/set/map | unordered_* |
|------|-------------|--------------|-------------|
| 插入 | 可能全部失效 | 不影响 | 可能失效 |
| 删除 | 删除点之后失效 | 只影响被删元素 | 可能失效 |
| 重新分配 | 全部失效 | N/A | N/A |

安全删除的写法：

${cpp(`// 删除满足条件的元素（正确方式）
auto it = v.begin();
while (it != v.end()) {
    if (*it % 2 == 0) {
        it = v.erase(it);  // erase 返回下一个有效的迭代器
    } else {
        ++it;
    }
}

// C++20 更简单的写法
std::erase_if(v, [](int x) { return x % 2 == 0; });`)}

**核心原则：** 如果可能修改容器的操作后，之前的迭代器视为失效，重新获取。`,
      code_examples: ['auto it = v.begin();\n++it;\nfor (auto rit = v.rbegin(); rit != v.rend(); ++rit) { }']
    },
  ]
});

// ============================================================
// 第 5 阶段：现代 C++
// ============================================================
STAGES.push({
  id: 'stage-5-modern-cpp',
  title: '第五阶段：现代 C++（C++11/14/17/20/23）',
  subsections: [
    {
      id: '5-1-auto-decltype',
      title: '5.1 auto 与 decltype 类型推导',
      content: `## auto —— 自动类型推导

\`auto\` 让编译器从初始化表达式推导变量的类型，是 Modern C++ 最常用的特性之一。

${cpp(`auto x = 42;                // int
auto y = 3.14;              // double
auto z = "hello";           // const char*
auto p = std::make_shared<int>(42);  // std::shared_ptr<int>

// auto 会忽略引用和顶层 const
int a = 10;
int &ref = a;
auto r = ref;               // int（引用被忽略）
const int ca = 10;
auto ca2 = ca;              // int（顶层 const 被忽略）
const auto ca3 = ca;        // const int（手动加 const）`)}

## auto 在范围 for 循环中的应用

${cpp(`std::vector<int> v = {1, 2, 3, 4};

for (auto x : v)          // 按值拷贝（修改不影响原容器）
for (auto &x : v)         // 按引用（可修改原容器）
for (const auto &x : v)   // 常量引用（只读，避免拷贝）
for (auto &&x : v)        // 通用引用（万能绑定）`)}

## decltype —— 获取表达式的类型

\`decltype\` 在**编译期**返回表达式的类型，不会实际执行表达式。

${cpp(`int a = 10;
decltype(a) b = 20;              // int
decltype((a)) c = a;             // int&（注意双括号表示引用）

// 在模板中非常有用
template <typename Container, typename Index>
decltype(auto) get(Container &c, Index i) {
    return c[i];  // 完美保留引用语义
}

// C++14 用 decltype(auto)
template <typename F, typename... Args>
decltype(auto) invoke(F f, Args&&... args) {
    return f(std::forward<Args>(args)...);
}`)}`,
      code_examples: ['auto x = 42;\nauto &ref = v[0];\ndecltype(x) y = 10;']
    },
    {
      id: '5-2-move-semantics',
      title: '5.2 右值引用与移动语义',
      content: `## 左值与右值

- **左值**（lvalue）：可以取地址、有名字的表达式（如变量、数组元素）
- **右值**（rvalue）：不能取地址、没有名字的临时值（如字面量、表达式返回值）

${cpp(`int a = 10;      // a 是左值，10 是右值
int b = a + 20;  // a+20 是右值
int *p = &a;     // OK，&a 取左值的地址
// int *q = &(a+20); // 错误！不能取右值的地址`)}

## 右值引用 &&

右值引用可以**绑定到右值**，从而知道这个对象是"临时"的，可以窃取它的资源而不是拷贝。

${cpp(`int &&rr = 42;       // OK，右值引用绑定到右值
// int &&rr2 = a;     // 错误！右值引用不能绑定左值
int &&rr3 = std::move(a);  // OK，move 将左值转为右值引用`)}

## 移动语义

移动语义的核心是**转移资源所有权**而不是深拷贝，避免了昂贵的拷贝操作。

${cpp(`class Buffer {
    int *data_;
    size_t size_;
public:
    // 拷贝构造（深拷贝）
    Buffer(const Buffer &other) : size_(other.size_) {
        data_ = new int[size_];
        std::copy(other.data_, other.data_ + size_, data_);
        std::cout << "拷贝构造\\n";
    }

    // 移动构造（窃取资源）
    Buffer(Buffer &&other) noexcept
        : data_(other.data_), size_(other.size_) {
        other.data_ = nullptr;   // 源对象置空
        other.size_ = 0;
        std::cout << "移动构造\\n";
    }

    ~Buffer() { delete[] data_; }
};

Buffer createBuffer() {
    Buffer b(1000);
    return b;  // 编译器优先使用移动语义（甚至可能 RVO）
}`)}

## std::move —— 左值转右值

\`std::move\` 不做任何实际移动，只是将参数转为右值引用，让编译器选择移动构造函数。

${cpp(`std::vector<int> v1 = {1, 2, 3, 4};
std::vector<int> v2 = std::move(v1);  // v1 的资源被转移到 v2
// 此时 v1 为空（有效但未指定状态）`)}

## 完美转发与 std::forward

${cpp(`template <typename T>
void wrapper(T &&arg) {           // 万能引用（注意：T&& 并不仅仅是右值引用）
    func(std::forward<T>(arg));   // 完美转发——保持参数的左右值属性
}

// 使用场景：工厂函数
template <typename T, typename... Args>
std::unique_ptr<T> make_unique(Args&&... args) {
    return std::unique_ptr<T>(new T(std::forward<Args>(args)...));
}`)}

**移动语义核心要点：**
1. 移动后源对象处于**有效但未指定的状态**，可以销毁或赋值，但不能假设其值
2. \`std::move\` 只是转换，不产生任何代码
3. 移动操作应该标记 \`noexcept\`，否则标准库可能选择拷贝而非移动`,
      code_examples: ['std::vector<int> v2 = std::move(v1);\nint &&rr = 42;']
    },
    {
      id: '5-3-smart-pointers',
      title: '5.3 智能指针',
      content: `## 智能指针概览

智能指针自动管理动态对象的生命周期，是现代 C++ **避免内存泄漏**的核心工具。

| 智能指针 | C++ 标准 | 所有权 | 特点 |
|---------|----------|--------|------|
| unique_ptr | C++11 | 独占 | 轻量，零开销，不可拷贝 |
| shared_ptr | C++11 | 共享 | 引用计数，有额外开销 |
| weak_ptr | C++11 | 弱引用 | 解决 shared_ptr 循环引用 |

## unique_ptr

${cpp(`#include <memory>

// 独占所有权，不可拷贝，可移动
std::unique_ptr<int> p1 = std::make_unique<int>(42);
// std::unique_ptr<int> p2 = p1;  // 编译错误！不可拷贝
std::unique_ptr<int> p2 = std::move(p1);  // OK，转移所有权
// 此时 p1 为 nullptr

// 应用于多态
std::unique_ptr<Shape> shape = std::make_unique<Circle>(5.0);
std::cout << shape->area();

// 自定义删除器
auto file_deleter = [](FILE *fp) { if (fp) fclose(fp); };
std::unique_ptr<FILE, decltype(file_deleter)> fp(fopen("a.txt", "r"), file_deleter);`)}

## shared_ptr

${cpp(`// 共享所有权，引用计数管理
std::shared_ptr<int> s1 = std::make_shared<int>(42);
{
    auto s2 = s1;  // 引用计数 +1
}  // 引用计数 -1

// 引用计数为 0 时自动释放

// 获取原始指针
int *raw = s1.get();

// 自定义删除器
std::shared_ptr<Dog> dog(new Dog(), [](Dog *d) {
    std::cout << "自定义删除\\n";
    delete d;
});`)}

## weak_ptr

解决 shared_ptr 的**循环引用**问题。

${cpp(`struct Node {
    int value;
    std::shared_ptr<Node> next;
    std::weak_ptr<Node> prev;  // 用 weak_ptr 打破循环
    ~Node() { std::cout << "~Node(" << value << ")\\n"; }
};

auto n1 = std::make_shared<Node>(1);
auto n2 = std::make_shared<Node>(2);
n1->next = n2;
n2->prev = n1;  // weak_ptr 不会增加引用计数

// weak_ptr 使用前需要 lock()
if (auto sp = n2->prev.lock()) {
    std::cout << sp->value;  // 安全访问
}

// expired() 检查资源是否已被释放
if (n2->prev.expired()) { /* 资源已释放 */ }`)}

## 智能指针选择指南

1. **优先用 unique_ptr** —— 零开销，最安全
2. **需要共享所有权时用 shared_ptr**
3. **用 make_unique / make_shared** 创建（异常安全、性能更好）
4. **避免** \`.get()\` 返回的裸指针在智能指针生命周期外使用`,
      code_examples: ['auto p = std::make_unique<int>(42);\nauto s = std::make_shared<int>(42);\nauto w = s;']
    },
    {
      id: '5-4-lambda',
      title: '5.4 Lambda 表达式',
      content: `## Lambda 基础

Lambda 表达式创建一个**匿名函数对象**，是 Modern C++ 中使用最广泛的特性之一。

${cpp(`// 基本语法：[捕获列表](参数列表) -> 返回类型 { 函数体 }

auto add = [](int a, int b) -> int { return a + b; };
std::cout << add(3, 4);  // 7

// 返回类型可以自动推导（省略 -> int）
auto mul = [](int a, int b) { return a * b; };`)}

## 捕获列表

${cpp(`int x = 10, y = 20;

auto f1 = [x]() { return x; };            // 按值捕获 x
auto f2 = [&x]() { x++; };                // 按引用捕获 x
auto f3 = [=]() { return x + y; };        // 按值捕获所有变量
auto f4 = [&]() { x++; y++; };            // 按引用捕获所有变量
auto f5 = [=, &y]() { return x + y; };    // 除 y 外按值捕获
auto f6 = [&, x]() { y++; return x; };    // 除 x 外按引用捕获

// 初始化捕获（C++14——移动语义）
auto p = std::make_unique<int>(42);
auto f7 = [p = std::move(p)]() { return *p; };
// 这里的 p 是 Lambda 内部的成员变量，而非外面的 p`)}

## 泛型 Lambda（C++14）

${cpp(`auto add = [](auto a, auto b) { return a + b; };
std::cout << add(3, 4);        // int
std::cout << add(3.14, 2.72);  // double

// 模板形式的 Lambda（C++20）
auto lambda = []<typename T>(T a, T b) { return a + b; };`)}

## Lambda 的实际应用场景

${cpp(`// 1. 与 STL 算法配合（最常见）
std::sort(v.begin(), v.end(), [](int a, int b) { return a > b; });

auto it = std::find_if(v.begin(), v.end(), [](int x) { return x > 10; });

// 2. 自定义删除器
auto deleter = [](FILE *f) { fclose(f); };
std::unique_ptr<FILE, decltype(deleter)> fp(fopen("a.txt", "r"), deleter);

// 3. 延迟计算
auto lazy = [expensive = computeExpensive()]() {
    // 在需要的时候才使用 expensive
    return expensive * 2;
};

// 4. 作用域内一次性逻辑
const auto result = [&]() {
    // 复杂计算逻辑
    int sum = 0;
    for (int x : data) sum += x;
    return sum / data.size();
}();  // 立即执行`)}

## mutable 关键字

按值捕获的 Lambda 默认是 const 的，\`mutable\` 允许修改它们。

${cpp(`int count = 0;
auto counter = [count]() mutable { return ++count; };
std::cout << counter();  // 1
std::cout << counter();  // 2
// 注意：外部的 count 不变，mutable 修改的是 Lambda 内部的拷贝`)}

**核心要点：**
- Lambda 在底层实现为一个匿名的仿函数类
- 默认按值捕获的变量是 const 的（除非 mutable）
- 引用捕获的变量在使用时可能已经销毁——注意生命周期`,
      code_examples: ['auto add = [](int a, int b) { return a + b; };\nstd::sort(v.begin(), v.end(), [](int a, int b) { return a > b; });']
    },
    {
      id: '5-5-modern-features',
      title: '5.5 Modern C++ 进阶特性',
      content: `## constexpr —— 编译时求值

${cpp(`// 编译时计算（C++11 起）
constexpr int factorial(int n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}
int arr[factorial(5)];  // 编译时确定的数组大小

// C++14 起 constexpr 函数可以包含循环和分支
constexpr int sum(int n) {
    int result = 0;
    for (int i = 1; i <= n; ++i) result += i;
    return result;
}

// C++20 起 constexpr 可以调用虚函数、动态分配等
constexpr int value = sum(100);  // 编译时计算

// if constexpr（C++17）——编译时条件分支
template <typename T>
auto get_value(T t) {
    if constexpr (std::is_pointer_v<T>) {
        return *t;
    } else {
        return t;
    }
}`)}

## 结构化绑定（C++17）

${cpp(`std::map<std::string, int> scores;

// 遍历 map
for (const auto &[name, score] : scores) {
    std::cout << name << ": " << score;
}

// 函数返回多个值
auto split(const std::string &s, char delim) -> std::pair<std::string, std::string>;
auto [first, second] = split("hello,world", ',');

// 数组
int arr[3] = {1, 2, 3};
auto [a, b, c] = arr;`)}

## std::optional / std::variant / std::any（C++17）

${cpp(`#include <optional>

// 可能无返回值的函数
std::optional<int> safe_divide(int a, int b) {
    if (b == 0) return std::nullopt;
    return a / b;
}

if (auto result = safe_divide(10, 2); result.has_value()) {
    std::cout << *result;    // 5
    std::cout << result.value();
}

// std::variant —— 类型安全的联合体
std::variant<int, double, std::string> v;
v = 42;                    // 存储 int
v = 3.14;                  // 存储 double
v = "hello";               // 存储 string

// 访问 variant
std::visit([](auto &&arg) {
    std::cout << arg;
}, v);

// std::any —— 存储任意类型（运行时多态，有额外开销）
std::any a = 42;
a = std::string("hello");
if (a.type() == typeid(std::string)) {
    auto s = std::any_cast<std::string>(a);
}`)}

## C++20 核心新特性

${cpp(`// Concepts —— 模板参数约束
template <std::integral T>
T add(T a, T b) { return a + b; }  // 只接受整数类型

// Ranges —— 更优雅的算法
#include <ranges>
auto result = v | std::views::filter([](int x) { return x % 2 == 0; })
                | std::views::transform([](int x) { return x * x; });

// Coroutines（协程）—— 异步编程基础设施
// 需要实现 promise_type，生成器代码量大，这里展示使用
generator<int> fibonacci() {
    int a = 0, b = 1;
    while (true) {
        co_yield a;
        auto tmp = a + b;
        a = b;
        b = tmp;
    }
}

// C++23: std::print
#include <print>
std::print("Hello {}!\\n", "world");  // 比 cout 更简洁更快`)}

**现代 C++ 核心建议：**
- 优先使用 \`constexpr\` 将计算移到编译期
- 用 \`std::optional\` 代替返回 -1 或 nullptr 表示"无值"
- 用 \`std::variant\` 代替 union
- 模板约束用 Concepts 而不是 SFINAE`,
      code_examples: ['constexpr int n = factorial(5);\nauto [k, v] = *map.begin();\nstd::optional<int> r = safe_divide(10, 2);']
    },
  ]
});

// ============================================================
// 第 6 阶段：数据结构与算法
// ============================================================
STAGES.push({
  id: 'stage-6-dsa',
  title: '第六阶段：数据结构与算法',
  subsections: [
    {
      id: '6-1-complexity',
      title: '6.1 复杂度分析',
      content: `## 时间复杂度

时间复杂度衡量算法执行时间随输入规模增长的变化趋势。

### 大 O 符号（从快到慢）

| 符号 | 名称 | 示例操作 |
|------|------|----------|
| O(1) | 常数时间 | 数组随机访问 |
| O(log n) | 对数时间 | 二分查找 |
| O(n) | 线性时间 | 遍历数组 |
| O(n log n) | 线性对数 | 快速排序 |
| O(n²) | 平方时间 | 冒泡排序 |
| O(2ⁿ) | 指数时间 | 斐波那契递归 |

${cpp(`// O(1) — 常数时间
int getFirst(const vector<int> &v) { return v[0]; }

// O(n) — 线性时间
int find(const vector<int> &v, int target) {
    for (size_t i = 0; i < v.size(); i++) {
        if (v[i] == target) return i;
    }
    return -1;
}

// O(n²) — 平方时间
void bubbleSort(vector<int> &v) {
    for (size_t i = 0; i < v.size(); i++) {
        for (size_t j = 0; j < v.size() - i - 1; j++) {
            if (v[j] > v[j + 1]) swap(v[j], v[j + 1]);
        }
    }
}

// O(log n) — 对数时间
int binarySearch(const vector<int> &v, int target) {
    int left = 0, right = v.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (v[mid] == target) return mid;
        if (v[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`)}

## 空间复杂度

算法临时占用的内存大小与输入规模的关系。

| 空间 | 含义 | 例子 |
|------|------|------|
| O(1) | 只使用固定额外空间 | 原地排序 |
| O(n) | 需要线性额外空间 | 归并排序 |

## 分析技巧

1. 只看**最坏情况**的复杂度
2. 忽略常数项（O(2n) → O(n)）
3. 嵌套循环相乘，顺序代码相加
4. 递归算法按递归树分析 |
`,
      code_examples: ['int binarySearch(vector<int> &v, int t) {\n    int l=0, r=v.size()-1;\n    while (l <= r) {\n        int m = l + (r-l)/2;\n        if (v[m]==t) return m;\n        if (v[m]<t) l=m+1; else r=m-1;\n    }\n    return -1;\n}']
    },
    {
      id: '6-2-sorting',
      title: '6.2 排序算法',
      content: `## 必须掌握的排序算法

### 快速排序（面试最常考）

${cpp(`int partition(vector<int> &v, int l, int r) {
    int pivot = v[r];  // 选最后一个为基准
    int i = l - 1;
    for (int j = l; j < r; j++) {
        if (v[j] <= pivot) {
            swap(v[++i], v[j]);
        }
    }
    swap(v[i + 1], v[r]);
    return i + 1;
}

void quickSort(vector<int> &v, int l, int r) {
    if (l >= r) return;
    int p = partition(v, l, r);
    quickSort(v, l, p - 1);
    quickSort(v, p + 1, r);
}
// 时间复杂度：平均 O(n log n)，最坏 O(n²)
// 空间复杂度：O(log n)（递归栈深度）`)}

### 归并排序

${cpp(`void merge(vector<int> &v, int l, int m, int r) {
    vector<int> left(v.begin() + l, v.begin() + m + 1);
    vector<int> right(v.begin() + m + 1, v.begin() + r + 1);
    int i = 0, j = 0, k = l;
    while (i < left.size() && j < right.size()) {
        v[k++] = left[i] <= right[j] ? left[i++] : right[j++];
    }
    while (i < left.size()) v[k++] = left[i++];
    while (j < right.size()) v[k++] = right[j++];
}

void mergeSort(vector<int> &v, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(v, l, m);
    mergeSort(v, m + 1, r);
    merge(v, l, m, r);
}
// 时间复杂度：O(n log n)（稳定）
// 空间复杂度：O(n)`)}

### 堆排序

${cpp(`void heapify(vector<int> &v, int n, int i) {
    int largest = i, left = 2*i + 1, right = 2*i + 2;
    if (left < n && v[left] > v[largest]) largest = left;
    if (right < n && v[right] > v[largest]) largest = right;
    if (largest != i) {
        swap(v[i], v[largest]);
        heapify(v, n, largest);
    }
}

void heapSort(vector<int> &v) {
    int n = v.size();
    for (int i = n/2 - 1; i >= 0; i--) heapify(v, n, i);
    for (int i = n - 1; i > 0; i--) {
        swap(v[0], v[i]);
        heapify(v, i, 0);
    }
}`)}

## 排序算法对比

| 算法 | 平均时间 | 最坏时间 | 空间 | 稳定 |
|------|---------|---------|------|------|
| 冒泡排序 | O(n²) | O(n²) | O(1) | ✅ |
| 选择排序 | O(n²) | O(n²) | O(1) | ❌ |
| 插入排序 | O(n²) | O(n²) | O(1) | ✅ |
| 快速排序 | O(n log n) | O(n²) | O(log n) | ❌ |
| 归并排序 | O(n log n) | O(n log n) | O(n) | ✅ |
| 堆排序 | O(n log n) | O(n log n) | O(1) | ❌ |
| 计数排序 | O(n + k) | O(n + k) | O(k) | ✅ |

**面试建议：** 手撕快排是高频考题，必须熟练到无 bug 写出。`,
      code_examples: ['void quickSort(vector<int> &v, int l, int r) {\n    if (l >= r) return;\n    int p = partition(v, l, r);\n    quickSort(v, l, p-1);\n    quickSort(v, p+1, r);\n}']
    },
    {
      id: '6-3-data-structures',
      title: '6.3 核心数据结构实现',
      content: `## 手写数据结构（面试高频）

### 1. 链表

${cpp(`struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

// 反转链表
ListNode *reverseList(ListNode *head) {
    ListNode *prev = nullptr, *curr = head;
    while (curr) {
        ListNode *next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}

// 合并两个有序链表
ListNode *mergeTwoLists(ListNode *l1, ListNode *l2) {
    ListNode dummy(0), *cur = &dummy;
    while (l1 && l2) {
        if (l1->val <= l2->val) { cur->next = l1; l1 = l1->next; }
        else { cur->next = l2; l2 = l2->next; }
        cur = cur->next;
    }
    cur->next = l1 ? l1 : l2;
    return dummy.next;
}`)}

### 2. 栈

${cpp(`template <typename T>
class Stack {
    std::vector<T> data_;
public:
    void push(const T &v) { data_.push_back(v); }
    void pop() { if (!empty()) data_.pop_back(); }
    T &top() { return data_.back(); }
    bool empty() const { return data_.empty(); }
    size_t size() const { return data_.size(); }
};`)}

### 3. 手写 vector

${cpp(`template <typename T>
class MyVector {
    T *data_ = nullptr;
    size_t size_ = 0;
    size_t capacity_ = 0;

    void reallocate(size_t new_cap) {
        T *new_data = static_cast<T *>(operator new(new_cap * sizeof(T)));
        for (size_t i = 0; i < size_; ++i) {
            new (new_data + i) T(std::move(data_[i]));  // placement new
        }
        for (size_t i = 0; i < size_; ++i) data_[i].~T();
        operator delete(data_);
        data_ = new_data;
        capacity_ = new_cap;
    }

public:
    void push_back(const T &val) {
        if (size_ >= capacity_) reallocate(capacity_ == 0 ? 1 : capacity_ * 2);
        new (data_ + size_) T(val);
        ++size_;
    }
    T &operator[](size_t i) { return data_[i]; }
    ~MyVector() {
        for (size_t i = 0; i < size_; ++i) data_[i].~T();
        operator delete(data_);
    }
};`)}

### 4. 二叉树遍历

${cpp(`struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

// 前序（递归）
void preorder(TreeNode *r) { if (!r) return; visit(r); preorder(r->left); preorder(r->right); }
// 中序（递归）
void inorder(TreeNode *r) { if (!r) return; inorder(r->left); visit(r); inorder(r->right); }
// 后序（递归）
void postorder(TreeNode *r) { if (!r) return; postorder(r->left); postorder(r->right); visit(r); }

// 前序（迭代——高频面试）
vector<int> preorderIterative(TreeNode *root) {
    vector<int> res;
    if (!root) return res;
    stack<TreeNode*> st; st.push(root);
    while (!st.empty()) {
        auto *n = st.top(); st.pop();
        res.push_back(n->val);
        if (n->right) st.push(n->right);  // 先右后左
        if (n->left) st.push(n->left);
    }
    return res;
}`)}

**LeetCode 刷题顺序建议：**
1. 数组/字符串
2. 链表
3. 哈希表
4. 栈/队列
5. 二叉树
6. 排序/搜索
7. 动态规划
8. 图`,
      code_examples: ['struct ListNode { int val; ListNode *next; };\nListNode *reverseList(ListNode *head);']
    },
  ]
});

// ============================================================
// 第 7 阶段：文件 I/O 与序列化
// ============================================================
STAGES.push({
  id: 'stage-7-file-io',
  title: '第七阶段：文件 I/O 与序列化',
  subsections: [
    {
      id: '7-1-file-streams',
      title: '7.1 文件流操作',
      content: `## 文本文件读写

${cpp(`#include <fstream>
#include <string>

// 写文本文件
std::ofstream ofs("data.txt");
if (!ofs) {
    std::cerr << "无法打开文件\\n";
    return;
}
ofs << "姓名: 张三\\n";
ofs << "年龄: 25\\n";
ofs << "分数: 92.5\\n";
ofs.close();

// 读文本文件
std::ifstream ifs("data.txt");
std::string line;
while (std::getline(ifs, line)) {
    std::cout << line << std::endl;
}`)}

## 二进制文件读写

${cpp(`#include <fstream>

struct Student {
    char name[32];
    int age;
    double score;
};

// 写二进制
Student s = {"张三", 25, 92.5};
std::ofstream ofs("student.bin", std::ios::binary);
ofs.write(reinterpret_cast<const char*>(&s), sizeof(s));
ofs.close();

// 读二进制
Student s2;
std::ifstream ifs("student.bin", std::ios::binary);
ifs.read(reinterpret_cast<char*>(&s2), sizeof(s2));`)}

## 文件状态与定位

${cpp(`std::ifstream ifs("data.txt");

// 文件大小
ifs.seekg(0, std::ios::end);
size_t size = ifs.tellg();
ifs.seekg(0, std::ios::beg);  // 回到开头

// 读取整个文件
std::string content((std::istreambuf_iterator<char>(ifs)),
                     std::istreambuf_iterator<char>());`)}

## 文件模式

| 模式 | 含义 |
|------|------|
| std::ios::in | 读取（ifstream 默认） |
| std::ios::out | 写入（ofstream 默认），会覆盖已有内容 |
| std::ios::app | 追加写入 |
| std::ios::ate | 打开后定位到末尾 |
| std::ios::binary | 二进制模式 |
| std::ios::trunc | 打开时清空内容 |

**最佳实践：**
- 对于简单配置，使用 JSON/INI 格式而非纯文本
- 二进制文件读写指定 \`std::ios::binary\` 模式
- 总是检查文件是否成功打开`,
      code_examples: ['std::ofstream ofs("data.txt");\nofs << "Hello";\nofs.close();']
    },
    {
      id: '7-2-json-serialization',
      title: '7.2 JSON 与序列化',
      content: `## 使用 nlohmann/json 库

JSON 是 C++ 项目中最常用的配置文件和数据交换格式。

${cpp(`#include <nlohmann/json.hpp>
using json = nlohmann::json;

// 构建 JSON
json j;
j["name"] = "张三";
j["age"] = 25;
j["scores"] = {95, 88, 92};
j["address"]["city"] = "北京";
j["address"]["district"] = "海淀";

// 序列化到字符串
std::string str = j.dump(4);  // 带缩进的漂亮输出

// 从字符串解析
json j2 = json::parse(str);
std::string name = j2["name"];
int age = j2["age"];
auto scores = j2["scores"].get<std::vector<int>>();`)}

## 自定义类型的序列化

${cpp(`struct Student {
    std::string name;
    int age;
    double score;
};

// 序列化
void to_json(json &j, const Student &s) {
    j = json{{"name", s.name}, {"age", s.age}, {"score", s.score}};
}

// 反序列化
void from_json(const json &j, Student &s) {
    j.at("name").get_to(s.name);
    j.at("age").get_to(s.age);
    j.at("score").get_to(s.score);
}

// 使用
Student s{"张三", 25, 92.5};
json j = s;  // 自动调用 to_json
Student s2 = j.get<Student>();  // 自动调用 from_json

// 读写 JSON 文件
std::ofstream("config.json") << j.dump(4);
json j3 = json::parse(std::ifstream("config.json"));`)}

## 序列化格式对比

| 格式 | 可读性 | 性能 | 类型安全 | 适用场景 |
|------|--------|------|---------|---------|
| JSON | 好 | 中等 | 弱 | 配置文件、API 通信 |
| XML | 好 | 慢 | 弱 | 遗留系统、文档 |
| YAML | 好 | 慢 | 弱 | 复杂配置 |
| Protobuf | 差 | 快 | 强 | 高性能通信 |
| 二进制 | 差 | 最快 | 自定义 | 游戏存档、内部存储 |

**建议：** 大多数 C++ 项目用 JSON 作为配置文件格式足够。高性能场景使用 Protobuf 或 FlatBuffers。`,
      code_examples: ['json j;\nj["name"] = "张三";\nstd::string s = j.dump();']
    },
  ]
});

// ============================================================
// 第 8 阶段：多线程与并发
// ============================================================
STAGES.push({
  id: 'stage-8-concurrency',
  title: '第八阶段：多线程与并发编程',
  subsections: [
    {
      id: '8-1-thread-basics',
      title: '8.1 线程基础',
      content: `## std::thread

C++11 起标准库提供了跨平台的线程支持。

${cpp(`#include <thread>
#include <iostream>

void worker(int id) {
    std::cout << "线程 " << id << " 开始工作\\n";
    std::this_thread::sleep_for(std::chrono::seconds(1));
    std::cout << "线程 " << id << " 结束\\n";
}

// 创建线程
std::thread t1(worker, 1);
std::thread t2(worker, 2);

// 必须 join 或 detach，否则析构时程序终止
t1.join();   // 等待线程结束
t2.detach(); // 分离线程（让它在后台运行）
// t2 可能还没执行完 main 就结束了，需要同步机制

// 获取当前线程信息
std::cout << std::this_thread::get_id() << std::endl;
std::cout << std::thread::hardware_concurrency() << " 个核心\\n";`)}

## std::jthread（C++20）

\`std::jthread\` 在析构时自动 join，并且支持**请求停止**。

${cpp(`#include <stop_token>  // C++20

std::jthread jt([](std::stop_token st) {
    while (!st.stop_requested()) {
        std::cout << "工作中..." << std::endl;
        std::this_thread::sleep_for(100ms);
    }
});

// 请求停止（析构时也会自动调用）
jt.request_stop();
// jt 析构时自动 join——无需手动 join`)}

## 线程 vs 进程

| 特性 | 线程 | 进程 |
|------|------|------|
| 创建开销 | 低 | 高 |
| 上下文切换 | 快 | 慢 |
| 内存共享 | 同一进程内共享 | 独立地址空间 |
| 通信方式 | 共享内存 | IPC（管道、消息队列等） |
| 隔离性 | 弱——一个线程崩溃影响整个进程 | 强 |

**核心原则：**
- 避免在需要高性能时创建销毁大量线程（使用线程池）
- 线程数通常不超过 \`hardware_concurrency()\``,
      code_examples: ['std::thread t(worker, 1);\nt.join();']
    },
    {
      id: '8-2-mutex-locks',
      title: '8.2 互斥锁与数据保护',
      content: `## 竞态条件与互斥锁

当多个线程同时访问共享数据时，需要**同步**来防止数据竞争。

${cpp(`#include <mutex>

std::mutex mtx;
int counter = 0;

void increment() {
    for (int i = 0; i < 100000; ++i) {
        mtx.lock();
        ++counter;  // 临界区
        mtx.unlock();
    }
}

// 推荐用 lock_guard（RAII 自动解锁）
void safe_increment() {
    for (int i = 0; i < 100000; ++i) {
        std::lock_guard<std::mutex> lock(mtx);
        ++counter;
    }  // 离开作用域时自动解锁
}`)}

## std::lock_guard vs std::unique_lock vs std::scoped_lock

${cpp(`std::mutex m1, m2;

// lock_guard —— 最简单的 RAII 封装（不可手动解锁）
{
    std::lock_guard<std::mutex> lock(m1);
    // 临界区
}

// unique_lock —— 更灵活，支持手动 unlock / lock
std::unique_lock<std::mutex> lock(m1);
lock.unlock();  // 提前解锁
// ...
lock.lock();    // 再次上锁

// scoped_lock（C++17）—— 同时锁多个互斥量（防死锁）
{
    std::scoped_lock lock(m1, m2);  // 同时锁住 m1 和 m2
    // 同时操作两个共享资源
}`)}

## 死锁的四个必要条件

1. **互斥**：资源一次只能被一个线程使用
2. **持有并等待**：线程持有资源的同时等待其他资源
3. **不可剥夺**：资源只能由持有者主动释放
4. **循环等待**：多个线程形成等待环路

${cpp(`// 死锁的例子
std::mutex a, b;

void thread1() {
    std::lock_guard<std::mutex> lock1(a);
    std::this_thread::sleep_for(1ms);
    std::lock_guard<std::mutex> lock2(b);  // 等 thread2 释放 b
}

void thread2() {
    std::lock_guard<std::mutex> lock1(b);
    std::this_thread::sleep_for(1ms);
    std::lock_guard<std::mutex> lock2(a);  // 等 thread1 释放 a
}

// 解决：用 std::lock 同时锁多个，或保证锁的顺序一致
std::scoped_lock both(a, b);  // C++17 推荐方式`)}

## 读写锁（shared_mutex）

多个线程读、一个线程写的场景。

${cpp(`#include <shared_mutex>

class ThreadSafeCache {
    mutable std::shared_mutex rw_lock_;
    std::map<std::string, int> cache_;
public:
    int get(const std::string &key) const {
        std::shared_lock lock(rw_lock_);  // 共享锁——多个线程可同时读
        auto it = cache_.find(key);
        return it != cache_.end() ? it->second : -1;
    }

    void set(const std::string &key, int value) {
        std::unique_lock lock(rw_lock_);  // 独占锁——写时不能有读
        cache_[key] = value;
    }
};`)}

**最佳实践：**
- 尽量缩小临界区范围（不要在整个函数上加锁，只在操作共享数据时）
- 优先用 \`lock_guard\` / \`scoped_lock\` 而非手动 lock/unlock
- 避免在临界区内调用可能阻塞的函数`,
      code_examples: ['std::mutex mtx;\nstd::lock_guard<std::mutex> lock(mtx);\n// 临界区']
    },
    {
      id: '8-3-atomics',
      title: '8.3 原子操作与无锁编程',
      content: `## std::atomic

原子操作是不需要互斥锁就能保证线程安全的操作。

${cpp(`#include <atomic>

std::atomic<int> counter{0};

void increment() {
    for (int i = 0; i < 100000; ++i) {
        counter.fetch_add(1);  // 原子递增
        // 或：++counter;
    }
}

// 对比——非原子版本会产生数据竞争
// volatile int counter{0};  // volatile 不能保证原子性！`)}

## 原子操作类型

${cpp(`std::atomic<bool> flag{false};
std::atomic<int> count{0};
std::atomic<long long> sum{0};
std::atomic<int*> ptr{nullptr};

// 原子操作
flag.store(true);          // 写
bool b = flag.load();      // 读
bool old = flag.exchange(false);  // 交换
bool expected = true;
bool changed = flag.compare_exchange_strong(expected, false);
// CAS（Compare-And-Swap）—— 无锁数据结构的基础`)}

## 内存序

内存序控制原子操作对其它线程的**可见性**。

${cpp(`// 不同内存序的性能和保证
std::atomic<int> x{0}, y{0};

// memory_order_relaxed —— 最宽松（最快），只保证原子性
x.store(42, std::memory_order_relaxed);

// memory_order_acquire —— 保证此操作后的读能看到之前的写
int v = y.load(std::memory_order_acquire);

// memory_order_release —— 保证此操作之前的写对其他线程可见
y.store(1, std::memory_order_release);

// memory_order_seq_cst —— 最严格（默认），全局顺序一致
x.store(42);  // 等同于 memory_order_seq_cst`)}

## 自旋锁

${cpp(`class SpinLock {
    std::atomic<bool> locked_{false};
public:
    void lock() {
        while (locked_.exchange(true, std::memory_order_acquire)) {
            // 忙等待——CPU 空转
            // 可以加 _mm_pause() 或 std::this_thread::yield()
        }
    }
    void unlock() {
        locked_.store(false, std::memory_order_release);
    }
};`)}

**何时用原子操作 vs 互斥锁：**
- 简单的计数/标志：用 atomic
- 复杂的数据结构操作：用 mutex
- 高性能场景（如统计）：用 atomic
- 多数情况下，mutex 就够用，不要过早优化`,
      code_examples: ['std::atomic<int> counter{0};\ncounter.fetch_add(1);']
    },
    {
      id: '8-4-async-future',
      title: '8.4 异步编程',
      content: `## std::future 和 std::async

异步编程允许在后台执行任务，稍后获取结果。

${cpp(`#include <future>

// 异步执行一个函数
std::future<int> result = std::async(std::launch::async, []() {
    std::this_thread::sleep_for(std::chrono::seconds(2));
    return 42;
});

// 做其他事情...
std::cout << "等待结果...\\n";

// 获取结果（阻塞直到完成）
int value = result.get();
std::cout << "结果: " << value << std::endl;`)}

## launch 策略

${cpp(`// 强制在新线程中执行
std::async(std::launch::async, func);

// 延迟执行（调用 get 时才在调用线程执行）
std::async(std::launch::deferred, func);

// 默认——由实现决定（通常等同于 async）
std::async(func);`)}

## std::promise

\`promise\` 是用来手动设置 \`future\` 值的工具。

${cpp(`std::promise<int> prom;
std::future<int> fut = prom.get_future();

// 在另一个线程中设置值
std::thread t([&prom]() {
    std::this_thread::sleep_for(1s);
    prom.set_value(42);
});

int result = fut.get();  // 会在 prom.set_value() 时返回
t.join();`)}

## std::packaged_task

将可调用对象包装为异步任务。

${cpp(`std::packaged_task<int(int, int)> task([](int a, int b) {
    return a + b;
});

std::future<int> result = task.get_future();

std::thread t(std::move(task), 3, 4);
t.join();

std::cout << result.get();  // 7`)}

## 条件变量

条件变量用于线程间的**事件通知**。

${cpp(`#include <condition_variable>

std::mutex mtx;
std::condition_variable cv;
bool ready = false;

// 等待线程
void worker() {
    std::unique_lock<std::mutex> lock(mtx);
    cv.wait(lock, []{ return ready; });  // 等待 ready 变为 true
    // 条件满足，继续执行
    std::cout << "开始工作\\n";
}

// 通知线程
void notify() {
    {
        std::lock_guard<std::mutex> lock(mtx);
        ready = true;
    }
    cv.notify_one();  // 唤醒一个等待线程
    // cv.notify_all();  // 唤醒所有等待线程
}`)}

**异步编程选择指南：**
- 简单异步任务 → \`std::async\`
- 需要手动设置结果 → \`std::promise\`
- 需要包装已有函数 → \`std::packaged_task\`
- 需要线程间事件通知 → \`condition_variable\`
- 复杂异步流 → 考虑 Boost.Asio 或 libuv`,
      code_examples: ['std::future<int> fut = std::async([]() { return 42; });\nint v = fut.get();']
    },
  ]
});

// ============================================================
// 第 9 阶段：网络编程
// ============================================================
STAGES.push({
  id: 'stage-9-network',
  title: '第九阶段：网络编程',
  subsections: [
    {
      id: '9-1-socket-basics',
      title: '9.1 Socket 编程基础',
      content: `## Socket 是什么

Socket 是操作系统提供的网络通信接口，允许不同主机上的程序交换数据。

## TCP Socket 核心 API

| 函数 | 用途 |
|------|------|
| socket() | 创建一个套接字 |
| bind() | 绑定到本地地址和端口 |
| listen() | 开始监听连接 |
| accept() | 接受客户端连接 |
| connect() | 连接到远程服务器 |
| send() / recv() | 发送/接收数据 |
| close() | 关闭套接字 |

## TCP 服务器示例（Linux）

${cpp(`#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>

int server_fd = socket(AF_INET, SOCK_STREAM, 0);

struct sockaddr_in addr;
addr.sin_family = AF_INET;
addr.sin_addr.s_addr = INADDR_ANY;
addr.sin_port = htons(8080);

bind(server_fd, (struct sockaddr*)&addr, sizeof(addr));
listen(server_fd, 5);

while (true) {
    int client = accept(server_fd, nullptr, nullptr);
    // 处理客户端请求（通常在新线程中）
    const char *msg = "Hello!\\n";
    send(client, msg, strlen(msg), 0);
    close(client);
}
close(server_fd);`)}

## TCP 客户端示例

${cpp(`int sock = socket(AF_INET, SOCK_STREAM, 0);

struct sockaddr_in addr;
addr.sin_family = AF_INET;
addr.sin_port = htons(8080);
inet_pton(AF_INET, "127.0.0.1", &addr.sin_addr);

connect(sock, (struct sockaddr*)&addr, sizeof(addr));

char buffer[1024] = {0};
recv(sock, buffer, sizeof(buffer), 0);
std::cout << "收到: " << buffer;

close(sock);`)}

## Windows 差异（Winsock）

Windows 上需要初始化 Winsock，且使用 \`closesocket()\` 而非 \`close()\`。

${cpp(`// Windows 特有初始化
WSADATA wsaData;
WSAStartup(MAKEWORD(2, 2), &wsaData);
// ... 使用 socket API ...
closesocket(sock);
WSACleanup();`)}

**关键概念：**
- \`htons\` / \`htonl\`：主机字节序 → 网络字节序（大端）
- \`ntohs\` / \`ntohl\`：网络字节序 → 主机字节序
- TCP 是**面向连接**的（先建立连接再通信）
- UDP 是**无连接**的（直接发数据包）`,
      code_examples: ['int fd = socket(AF_INET, SOCK_STREAM, 0);\nbind(fd, ...);\nlisten(fd, 5);\naccept(fd, ...);']
    },
    {
      id: '9-2-io-multiplexing',
      title: '9.2 I/O 多路复用',
      content: `## 为什么需要 I/O 多路复用

一个服务器需要同时处理多个客户端连接。为每个连接创建一个线程的模型在连接数多时不可扩展。

I/O 多路复用允许**一个线程同时监视多个 socket**。

## select / poll / epoll 对比

${cpp(`// select —— 最古老，FD_SETSIZE 限制（通常 1024）
fd_set read_fds;
FD_ZERO(&read_fds);
FD_SET(socket_fd, &read_fds);
select(socket_fd + 1, &read_fds, nullptr, nullptr, nullptr);
if (FD_ISSET(socket_fd, &read_fds)) {
    // 可读
}

// epoll —— Linux 高性能方案（无上限，事件驱动）
int epfd = epoll_create1(0);
struct epoll_event ev;
ev.events = EPOLLIN;
ev.data.fd = socket_fd;
epoll_ctl(epfd, EPOLL_CTL_ADD, socket_fd, &ev);

struct epoll_event events[1024];
int n = epoll_wait(epfd, events, 1024, -1);
for (int i = 0; i < n; i++) {
    // events[i].data.fd 可读
}`)}

## epoll 的工作模式

| 模式 | 含义 | 使用场景 |
|------|------|----------|
| LT（水平触发） | 只要还有数据可读，就一直通知 | 简单，不容易漏事件 |
| ET（边缘触发） | 只有状态变化时才通知，需要一次读完 | 高性能，需配合非阻塞 I/O |

## IOCP（Windows 高性能方案）

Windows 上的 I/O 完成端口（IOCP）是最高效的异步 I/O 模型。

${cpp(`// IOCP 核心概念：将 I/O 操作投递到完成端口
// 工作线程从完成端口取结果，不必等待 I/O 完成
HANDLE iocp = CreateIoCompletionPort(INVALID_HANDLE_VALUE, NULL, 0, 0);
CreateIoCompletionPort((HANDLE)socket, iocp, (ULONG_PTR)socket, 0);

// 工作线程循环
while (true) {
    DWORD bytes;
    ULONG_PTR key;
    Overlapped *ov = nullptr;
    GetQueuedCompletionStatus(iocp, &bytes, &key, (LPOVERLAPPED*)&ov, INFINITE);
    // key 是 socket，ov 包含操作信息
}`)}

## 常用 C++ 网络库

| 库 | 特点 | 学习难度 |
|----|------|---------|
| Boost.Asio | 跨平台，功能最强 | 中~高 |
| libuv | Node.js 底层引擎，跨平台 | 中 |
| cpp-httplib | 轻量 HTTP 库，header-only | 低 |
| POCO | 完整 C++ 网络框架 | 中 |

**建议：** 先掌握 Socket API 基础 + epoll/IOCP 原理，实际项目使用 Boost.Asio 或 libuv。`,
      code_examples: ['int epfd = epoll_create1(0);\nepoll_ctl(epfd, EPOLL_CTL_ADD, fd, &ev);\nepoll_wait(epfd, events, 1024, -1);']
    },
  ]
});

// ============================================================
// 第 10 阶段：设计模式
// ============================================================
STAGES.push({
  id: 'stage-10-design-patterns',
  title: '第十阶段：设计模式与架构',
  subsections: [
    {
      id: '10-1-solid',
      title: '10.1 SOLID 原则',
      content: `## SOLID 五大原则

### S — 单一职责原则（Single Responsibility）

一个类只应该有一个职责，只有一个引起它变化的原因。

${cpp(`// ❌ 违反 SRP：一个类既保存数据又处理文件操作和渲染
class Employee {
    string name;
    double salary;
    void saveToFile() { /* ... */ }
    void renderHTML() { /* ... */ }
};

// ✅ 符合 SRP：职责分离
class Employee { /* 只存数据 */ };
class EmployeeRepository { /* 负责持久化 */ };
class EmployeeView { /* 负责渲染 */ };`)}

### O — 开闭原则（Open/Closed）

对扩展开放，对修改关闭。

${cpp(`// 通过多态实现扩展
class Shape {
public:
    virtual double area() const = 0;
};

class Circle : public Shape {
    double r_;
public:
    double area() const override { return 3.14 * r_ * r_; }
};

class Rectangle : public Shape {
    double w_, h_;
public:
    double area() const override { return w_ * h_; }
};

// 新增三角形不需要修改 Shape 基类和已有代码
class Triangle : public Shape {
    double b_, h_;
public:
    double area() const override { return 0.5 * b_ * h_; }
};`)}

### L — 里氏替换原则（Liskov Substitution）

派生类必须能够替换其基类而不影响程序正确性。

${cpp(`// ❌ 违反 LSP：正方形继承矩形
class Rectangle {
    virtual void setWidth(double w) { width_ = w; }
    virtual void setHeight(double h) { height_ = h; }
};

class Square : public Rectangle {
    void setWidth(double w) override {
        Rectangle::setWidth(w);
        Rectangle::setHeight(w);  // 修改了预期行为！
    }
};`)}

### I — 接口隔离原则（Interface Segregation）

不应该强迫客户端依赖它们不使用的接口。

### D — 依赖反转原则（Dependency Inversion）

高层模块不应该依赖低层模块，两者都应该依赖抽象。

${cpp(`// ❌ 违反 DIP：高层直接依赖低层实现
class MySQLDatabase { /* ... */ };
class UserService {
    MySQLDatabase db_;  // 直接依赖具体实现
};

// ✅ 符合 DIP：依赖抽象接口
class IDatabase {
public:
    virtual ~IDatabase() = default;
    virtual void save(const User &u) = 0;
};

class UserService {
    IDatabase &db_;  // 依赖抽象
public:
    UserService(IDatabase &d) : db_(d) {}
};

// 可以轻松替换为任何数据库
class PostgresDatabase : public IDatabase { /* ... */ };`)}`,
      code_examples: ['class Shape { public: virtual double area() const = 0; };']
    },
    {
      id: '10-2-common-patterns',
      title: '10.2 常用设计模式',
      content: `## 单例模式（Singleton）

${cpp(`class Singleton {
public:
    static Singleton &getInstance() {
        static Singleton instance;  // C++11 起线程安全的局部静态变量
        return instance;
    }
    Singleton(const Singleton &) = delete;
    Singleton &operator=(const Singleton &) = delete;
private:
    Singleton() = default;  // 私有构造
    ~Singleton() = default;
};`)}

## 工厂模式（Factory）

${cpp(`enum class ShapeType { Circle, Rectangle };

// 简单工厂
std::unique_ptr<Shape> createShape(ShapeType type) {
    switch (type) {
        case ShapeType::Circle:    return std::make_unique<Circle>(5.0);
        case ShapeType::Rectangle: return std::make_unique<Rectangle>(3, 4);
    }
    throw std::invalid_argument("未知类型");
}`)}

## 观察者模式（Observer）

${cpp(`// 事件发射器
class EventEmitter {
    std::vector<std::function<void(int)>> listeners_;
public:
    void on(std::function<void(int)> cb) { listeners_.push_back(std::move(cb)); }
    void emit(int data) {
        for (auto &cb : listeners_) cb(data);
    }
};

EventEmitter emitter;
emitter.on([](int v) { std::cout << "收到: " << v << std::endl; });
emitter.emit(42);`)}

## 策略模式（Strategy）

${cpp(`// 排序策略
class ISortStrategy {
public:
    virtual ~ISortStrategy() = default;
    virtual void sort(std::vector<int> &v) const = 0;
};

class QuickSortStrategy : public ISortStrategy {
public:
    void sort(std::vector<int> &v) const override { /* 快排实现 */ }
};

class MergeSortStrategy : public ISortStrategy {
public:
    void sort(std::vector<int> &v) const override { /* 归并实现 */ }
};

class Sorter {
    const ISortStrategy &strategy_;
public:
    Sorter(const ISortStrategy &s) : strategy_(s) {}
    void sort(std::vector<int> &v) const { strategy_.sort(v); }
};`)}`,
      code_examples: ['Singleton &getInstance() { static Singleton instance; return instance; }']
    },
  ]
});

// ============================================================
// 第 11 阶段：工程化与工具链
// ============================================================
STAGES.push({
  id: 'stage-11-engineering',
  title: '第十一阶段：工程化与工具链',
  subsections: [
    {
      id: '11-1-cmake',
      title: '11.1 CMake 构建系统',
      content: `## 现代 CMake（3.x）

CMake 是 C++ 项目的事实标准构建工具。

### 单文件项目

${cpp(`# CMakeLists.txt
cmake_minimum_required(VERSION 3.16)
project(MyApp)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(myapp main.cpp)`)}

### 多目录项目

${cpp(`# 顶层 CMakeLists.txt
cmake_minimum_required(VERSION 3.20)
project(MyProject)

add_subdirectory(src)
add_subdirectory(libs)
add_subdirectory(tests)`)}

### 使用第三方库

${cpp(`# 使用 FetchContent 自动下载（无需手动安装）
include(FetchContent)

FetchContent_Declare(
    nlohmann_json
    GIT_REPOSITORY https://github.com/nlohmann/json.git
    GIT_TAG v3.11.2
)
FetchContent_MakeAvailable(nlohmann_json)

# 或者用 find_package 找已安装的库
find_package(fmt CONFIG REQUIRED)

target_link_libraries(myapp PRIVATE nlohmann_json::nlohmann_json fmt::fmt)`)}

## vcpkg 包管理器

\`\`\`bash
# 安装 vcpkg
git clone https://github.com/Microsoft/vcpkg.git
cd vcpkg && ./bootstrap-vcpkg.sh

# 安装库
./vcpkg install fmt
./vcpkg install nlohmann-json

# 与 CMake 集成
cmake -B build -S . -DCMAKE_TOOLCHAIN_FILE=/path/to/vcpkg/scripts/buildsystems/vcpkg.cmake
\`\`\`

## 编译与构建步骤

\`\`\`bash
# 配置阶段
cmake -B build -DCMAKE_BUILD_TYPE=Release

# 构建阶段
cmake --build build -j8

# 安装
cmake --install build --prefix /usr/local

# 常用 CMake 选项
# -DCMAKE_BUILD_TYPE=Debug/Release/RelWithDebInfo
# -DCMAKE_INSTALL_PREFIX=/path
# -DBUILD_SHARED_LIBS=ON/OFF
\`\`\`

**核心概念：**
- \`target_link_libraries\` —— 传递依赖自动管理
- \`PUBLIC\` / \`PRIVATE\` / \`INTERFACE\` —— 控制可见性
- \`Modern CMake\` 的核心是 target，而非变量`,
      code_examples: ['cmake_minimum_required(VERSION 3.16)\nproject(MyApp)\nadd_executable(myapp main.cpp)']
    },
    {
      id: '11-2-testing',
      title: '11.2 单元测试',
      content: `## Google Test

${cpp(`#include <gtest/gtest.h>

// 被测试函数
int add(int a, int b) { return a + b; }
bool isEven(int n) { return n % 2 == 0; }

// 测试用例
TEST(MathTest, Add) {
    EXPECT_EQ(add(2, 3), 5);
    EXPECT_EQ(add(-1, 1), 0);
    EXPECT_NE(add(2, 2), 5);
}

TEST(MathTest, IsEven) {
    EXPECT_TRUE(isEven(4));
    EXPECT_FALSE(isEven(3));
}

// 测试夹具（Test Fixture）
class MyTestFixture : public ::testing::Test {
protected:
    void SetUp() override { /* 每个测试前执行 */ }
    void TearDown() override { /* 每个测试后执行 */ }
};

TEST_F(MyTestFixture, SomeTest) {
    // 使用 fixture
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}`)}

## Catch2（另一种选择）

${cpp(`#define CATCH_CONFIG_MAIN
#include <catch2/catch.hpp>

TEST_CASE("数学测试") {
    SECTION("加法") {
        REQUIRE(add(2, 3) == 5);
        CHECK(add(-1, 1) == 0);  // CHECK 失败继续执行
    }
    SECTION("偶数判断") {
        REQUIRE(isEven(4));
        REQUIRE_FALSE(isEven(3));
    }
}`)}

## 测试金字塔

\`\`\`
        /\\
       /  \\        E2E 测试（少）
      /    \\
     /      \\      集成测试（中）
    /________\\
   / 单元测试  \\   单元测试（多）
  /____________\\
\`\`\`

## CMake + Google Test 集成

${cpp(`# CMakeLists.txt
include(FetchContent)
FetchContent_Declare(
    googletest
    GIT_REPOSITORY https://github.com/google/googletest.git
    GIT_TAG v1.14.0
)
FetchContent_MakeAvailable(googletest)

add_executable(my_test test_main.cpp)
target_link_libraries(my_test PRIVATE gtest_main gmock)
add_test(NAME my_test COMMAND my_test)`)}`,
      code_examples: ['TEST(MathTest, Add) {\n    EXPECT_EQ(add(2, 3), 5);\n}']
    },
    {
      id: '11-3-git',
      title: '11.3 Git 进阶',
      content: `## 必须掌握的 Git 技能

### 日常操作
\`\`\`bash
git clone <repo>
git add .
git commit -m "feat: 添加新功能"
git push
git pull --rebase  # 用 rebase 代替 merge 拉取
\`\`\`

### 分支管理
\`\`\`bash
git branch feature-login           # 创建分支
git checkout -b feature-login      # 创建并切换
git merge feature-login            # 合并到当前分支
git rebase main                    # 变基
git cherry-pick <commit-hash>      # 挑选某个提交
\`\`\`

### 处理冲突
\`\`\`bash
# 当合并冲突时
git status                         # 查看冲突文件
# 手动解决冲突后
git add <file>
git commit                         # 完成合并

# 或者放弃合并
git merge --abort
\`\`\`

### 后悔药
\`\`\`bash
git reset HEAD~1                   # 撤销最后一次提交（保留修改）
git reset --hard HEAD~1            # 撤销最后一次提交（丢弃修改）
git revert HEAD                    # 安全的撤销——创建一个反向提交
git stash                          # 暂存当前修改
git stash pop                      # 恢复暂存的修改
\`\`\`

### 代码审查（Code Review）
\`\`\`bash
# 创建 PR 前确保代码整洁
git rebase -i HEAD~3               # 交互式 rebase，合并最近的 3 个提交
# pick → squash → reword...

# 查看变更
git diff                           # 工作区 vs 暂存区
git diff --cached                  # 暂存区 vs 仓库
git log --oneline --graph          # 简洁的提交历史
\`\`\`

### 提交信息规范

\`\`\`
feat: 新功能
fix: Bug 修复
refactor: 重构
docs: 文档
test: 测试
chore: 构建/工具
style: 代码格式（不影响功能）
\`\`\``,
      code_examples: ['git rebase -i HEAD~3\ngit commit -m "feat: add login"']
    },
  ]
});

// ============================================================
// 第 12 阶段：面试与就业
// ============================================================
STAGES.push({
  id: 'stage-12-interview',
  title: '第十二阶段：面试与就业特训',
  subsections: [
    {
      id: '12-1-top-interview-questions',
      title: '12.1 C++ 高频面试题',
      content: `## C++ 面试最高频 20 题

### 1. 虚函数表（vtable）的工作原理

每个有虚函数的类有一个 vtable，存储虚函数地址。每个对象有一个 vptr 指向 vtable。调用虚函数时通过 vptr 查表找到实际函数地址。这是**动态绑定**的实现机制。

### 2. 指针和引用的区别

| 指针 | 引用 |
|------|------|
| 是一个变量，存储地址 | 是别名，没有独立内存（底层也是指针实现） |
| 可以为空 (nullptr) | 不能为空，必须初始化 |
| 可以重新指向 | 一旦绑定不可改变 |
| 有指针运算 | 没有引用运算 |

### 3. malloc/free 和 new/delete 的区别

- new 调用构造函数，malloc 只分配内存
- new 是运算符，malloc 是函数
- new 返回类型安全的指针，malloc 返回 void*
- new 失败抛异常，malloc 返回 nullptr
- new 可以被运算符重载，malloc 不能

### 4. 智能指针的原理

\`unique_ptr\`：独占所有权，禁止拷贝，支持移动。\`shared_ptr\`：引用计数，多个指针共享所有权。\`weak_ptr\`：弱引用，不增加计数，解决循环引用。

### 5. 深拷贝 vs 浅拷贝

浅拷贝只拷贝指针值（两个对象指向同一内存），深拷贝分配新内存并拷贝内容。管理动态资源的类需要**自定义拷贝构造函数和拷贝赋值运算符**来实现深拷贝。

### 6. move 语义的原理

\`std::move\` 将左值转换为右值引用，触发移动构造函数，**窃取**源对象的资源（如指针），然后将源对象置为空状态。避免了深拷贝的开销。

### 7. 四种 cast 的区别

\`static_cast\`：编译时检查，最常用。\`dynamic_cast\`：运行时检查，用于多态类型向下转型。\`const_cast\`：移除 const。\`reinterpret_cast\`：最危险，位级重新解释。

### 8. RAII 是什么

资源获取即初始化——在构造函数中获取资源，在析构函数中释放。是 C++ 资源管理的核心原则，实现异常安全和自动资源管理。

### 9. 什么是未定义行为（UB）

程序的行为不受 C++ 标准的约束。常见 UB：解引用空指针、数组越界、有符号整数溢出、使用未初始化的变量、double free。UB 可能产生任何结果——崩溃、静默错误、甚至看起来正常。

### 10. 内存对齐

编译器在结构体成员之间插入填充字节，使每个成员的地址对齐到其大小的倍数。CPU 访问对齐的内存效率更高。

${cpp(`struct A {       // 实际 8 字节（不是 5）
    char a;      // 1 字节
    // 3 字节填充
    int b;       // 4 字节
};`)}

### 11. constexpr vs const

\`const\`：运行时常量（但不一定，取决于上下文）。\`constexpr\`：编译期常量，强制在编译时求值。C++20 起 constexpr 函数可以包含动态分配和虚函数。

### 12. static 关键字的各个用法

1. **静态局部变量**：函数内，只初始化一次，生命周期持续到程序结束
2. **静态全局变量/函数**：文件内可见（内部链接）
3. **静态成员变量/函数**：属于类而非对象
4. \`static_cast\`：类型转换

### 13. 野指针和空指针

空指针（\`nullptr\`）指向明确定义的"空地址"，解引用会崩溃（可检测）。野指针指向已释放或随机的内存，解引用后果未定义，最难排查。预防：释放后将指针置为 nullptr。

### 14. 内联函数和宏的区别

内联函数有类型检查，宏只是文本替换。内联函数遵循作用域规则。编译器可以选择忽略 inline 建议。宏可以做"胶水代码"（如 \`#define LOG(x) cout << #x << "=" << (x)\`）。

### 15. 什么是多态

多态指**同一接口，不同实现**。编译时多态（函数重载、模板）和运行时多态（虚函数）。运行时多态通过虚函数表实现，可以在运行时动态选择调用哪个派生类的函数。

### 16. vector 的扩容机制

当元素数量达到容量时，重新分配新内存（通常为当前容量的 1.5~2 倍），**移动**所有元素到新内存，然后释放旧内存。频繁扩容有性能开销。

### 17. 如何避免死锁

1. 固定锁的顺序
2. 使用 \`std::lock\` 或 \`std::scoped_lock\` 一次性锁多个
3. 尽量缩小临界区
4. 使用超时锁 \`std::timed_mutex\` 的 try_lock

### 18. 左值和右值的区别

左值有内存地址，可以取地址。右值是临时值，没有地址。右值引用 \`&&\` 可以延长临时对象的生命周期，并触发移动语义。

### 19. 什么是完美转发

通过万能引用（\`T&&\`）+ \`std::forward\`，保持函数参数的左右值属性不变地传递给另一个函数。

### 20. 哪些 C++11/14/17/20 特性你常用

auto、智能指针、Lambda、右值引用/移动语义、constexpr、范围 for、nullptr、unordered_* 容器、std::optional、结构化绑定、C++20 Concepts/Ranges、std::format / std::print`,
      code_examples: ['// 高频手撕题\nvoid reverseString(vector<char> &s) {\n    int l = 0, r = s.size() - 1;\n    while (l < r) swap(s[l++], s[r--]);\n}']
    },
    {
      id: '12-2-hands-on',
      title: '12.2 手撕代码高频题',
      content: `## 面试中必须自己能写出来的代码

### 1. 实现 String 类

${cpp(`class String {
    char *data_;
public:
    String() : data_(new char[1]{}) {}
    String(const char *s) : data_(new char[strlen(s) + 1]) {
        strcpy(data_, s);
    }
    String(const String &other) : String(other.data_) {}  // 深拷贝

    String(String &&other) noexcept : data_(other.data_) {
        other.data_ = nullptr;
    }
    String &operator=(String other) {  // copy-and-swap
        swap(*this, other);
        return *this;
    }
    ~String() { delete[] data_; }

    friend void swap(String &a, String &b) noexcept {
        std::swap(a.data_, b.data_);
    }
};`)}

### 2. 实现 shared_ptr

${cpp(`template <typename T>
class SharedPtr {
    T *ptr_;
    int *ref_count_;
public:
    explicit SharedPtr(T *p = nullptr) : ptr_(p), ref_count_(new int(1)) {}
    SharedPtr(const SharedPtr &other)
        : ptr_(other.ptr_), ref_count_(other.ref_count_) {
        ++(*ref_count_);
    }
    ~SharedPtr() {
        if (--(*ref_count_) == 0) {
            delete ptr_;
            delete ref_count_;
        }
    }
    T &operator*() { return *ptr_; }
    T *operator->() { return ptr_; }
};`)}

### 3. 实现线程池

${cpp(`class ThreadPool {
    std::vector<std::thread> workers_;
    std::queue<std::function<void()>> tasks_;
    std::mutex mtx_;
    std::condition_variable cv_;
    bool stop_ = false;

public:
    ThreadPool(size_t n) {
        for (size_t i = 0; i < n; ++i) {
            workers_.emplace_back([this] {
                while (true) {
                    std::function<void()> task;
                    {
                        std::unique_lock lock(mtx_);
                        cv_.wait(lock, [this] {
                            return stop_ || !tasks_.empty();
                        });
                        if (stop_ && tasks_.empty()) return;
                        task = std::move(tasks_.front());
                        tasks_.pop();
                    }
                    task();  // 执行任务
                }
            });
        }
    }

    template <class F, class... Args>
    auto enqueue(F &&f, Args &&...args)
        -> std::future<std::invoke_result_t<F, Args...>> {
        using ReturnType = std::invoke_result_t<F, Args...>;
        auto task = std::make_shared<std::packaged_task<ReturnType()>>(
            std::bind(std::forward<F>(f), std::forward<Args>(args)...)
        );
        std::future<ReturnType> result = task->get_future();
        {
            std::lock_guard lock(mtx_);
            tasks_.emplace([task]() { (*task)(); });
        }
        cv_.notify_one();
        return result;
    }

    ~ThreadPool() {
        { std::lock_guard lock(mtx_); stop_ = true; }
        cv_.notify_all();
        for (auto &w : workers_) w.join();
    }
};

// 使用
ThreadPool pool(4);
auto fut = pool.enqueue([](int a, int b) { return a + b; }, 3, 4);
std::cout << fut.get();  // 7`)}

### 4. 单例模式

${cpp(`class Singleton {
public:
    static Singleton &instance() {
        static Singleton inst;  // C++11 起线程安全
        return inst;
    }
    Singleton(const Singleton &) = delete;
    Singleton &operator=(const Singleton &) = delete;
private:
    Singleton() = default;
    ~Singleton() = default;
};`)}`,
      code_examples: ['class String {\npublic:\n    String(const String &other); // 深拷贝\n};']
    },
    {
      id: '12-3-project-guide',
      title: '12.3 简历项目建议',
      content: `## 推荐项目方向

以下项目按难度排序，选 2-3 个深入做，放进简历。

### 初级项目（适合 0-1 年经验）

**1. 高性能日志库**
- 异步写入、多级别日志、支持文件滚动、格式化输出
- 用到：设计模式（单例）、多线程（生产者-消费者）、文件 I/O
- 技术点：双缓冲、批量写入减少 IO 次数

**2. Web 服务器**
- 支持 HTTP/1.1 的静态文件服务器
- 用到：Socket 编程、epoll 多路复用、线程池、解析 HTTP 协议
- 可扩展：支持 CGI、添加缓存层

### 中级项目（适合 1-3 年经验）

**3. 内存数据库 / KV 存储**
- 实现一个简单的内存 KV 存储，支持 SET/GET/DELETE
- 用到：哈希表、跳表、LSM-Tree、序列化
- 可扩展：添加持久化、网络协议、复制

**4. 游戏引擎核心模块**（ECS 架构）
- Entity-Component-System 架构
- 用到：模板元编程、对象池、内存管理、多线程
- 技术点：组件的内存连续存储（缓存友好）

**5. C++ 协程库**
- 基于 C++20 Coroutines 的简易协程库
- 用到：协程 promise_type、RAII、完美转发

### 高级项目（3 年以上经验）

**6. 分布式 RPC 框架**
- 服务注册/发现、序列化（Protobuf）、连接池
- 用到：网络编程、多线程、设计模式、性能优化

**7. 跨平台渲染引擎**
- 基于 OpenGL/Vulkan 的轻量渲染引擎
- 用到：C++17/20、GPU 编程、计算几何

## 简历格式

### 项目描述格式（STAR 法则）

\`\`\`
项目名称：高性能异步日志库

技术栈：C++17、多线程、双缓冲

项目描述：
- 设计并实现了日均处理数千万条日志的异步日志库
- 采用双缓冲技术，将 IO 操作从业务线程分离到后台线程
- 使用 RAII 管理文件资源，保证异常安全
- 支持日志分级、文件滚动（按时/按大小）、运行时配置
- 相比 spdlog benchmark，相同场景下吞吐量约 80%

难点与解决方案：
- 避免日志丢失：使用有界队列 + 丢弃策略
- 减少锁竞争：每个线程一个独立的缓冲区
\`\`\``,
      code_examples: ['// 日志库核心：双缓冲队列\nstd::vector<std::string> buffers_[2];\nstd::atomic<int> current_buffer_{0};']
    },
  ]
});

// ============================================================
// 生成完整知识库
// ============================================================
const FULL_KNOWLEDGE = {
  meta: {
    totalStages: STAGES.length,
    totalSubsections: STAGES.reduce((sum, s) => sum + s.subsections.length, 0),
    generatedAt: new Date().toISOString(),
    description: 'C++ 完整学习路径（零基础 → 就业）',
  },
  sections: STAGES,
};

// 输出统计
console.log(`📚 完整知识库生成完毕：
  阶段数: ${FULL_KNOWLEDGE.meta.totalStages}
  小节数: ${FULL_KNOWLEDGE.meta.totalSubsections}
`);


STAGES.forEach((s, i) => {
  console.log(`  ${String(i + 1).padStart(2)}. ${s.title} —— ${s.subsections.length} 小节`);
});

// 写入文件
const outputPath = path.join(__dirname, '..', 'backend', 'data', 'knowledge.json');
fs.writeFileSync(outputPath, JSON.stringify(FULL_KNOWLEDGE, null, 2), 'utf-8');
console.log(`\n✅ 输出: ${outputPath}`);
