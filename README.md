# atool-test

---
 
 工具调试:
 
 ```
 $ git clone atool-test
 $ cd atool-test
 $ tnpm install
 $ cd testing-demo
 $ npm install
 $ npm test
 ```
 
---

## 使用

> 约定: 测试文件的文件名加 -test

```
"srcipts": {
  "test": "atool-test"
}

可以指定要测试的目录 atool-test --test-dir test

默认测试目录为项目目录下的 __test__

```

## 特性

- 基于 mocha 实现
- 内置 es2015, react, stage-0, expect 等常用测试工具类库 
- 更专注于测试用例本身


