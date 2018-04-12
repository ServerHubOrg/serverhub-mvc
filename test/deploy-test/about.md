# Test introduction

## About Deployment Test
This test mainly test with HTTP response status code. Successful test results are supposed to return responses with valid status code.

So the test case with hypothesis should display expected status code. Here is an example:

```
[404] '/' should not match any resources
```