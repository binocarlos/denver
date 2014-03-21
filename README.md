denver
======

Create layers of ENV variables saved to etcd and deploy docker containers using them

## installation

Copy the binary to /usr/local/bin

## usage

denver will save ENV variables for a stack under a key in etcd.

it will merge stacks in order so one stack can inherit from another.

it will spit out stacks environment in a few useful formats.

## denver ls

List the stack names we have environments for

## denver get <stack> <var>

Print the value of a single environment variable

```bash
$ denver get myapp ADMIN_EMAIL
```

## denver set <stack> <var> <value>

Write the value of a single environment variable

```bash
$ denver set myapp ADMIN_EMAIL bob@thebuilder.com
```

## denver del <stack> <var>

Remove a value from an environment

```bash
$ denver del myapp ADMIN_EMAIL
```

## denver env <stack> <format>

Print the whole environment for a stack in the given format

```bash
$ denver env myapp
```

```
ADMIN_EMAIL=bob@thebuilder.com
HOSTNAME=bobthebuilder.com
```

You can also print the environment in a docker friendly format:

```
$ denver env myapp docker
```

```
-e ADMIN_EMAIL=bob@thebuilder.com -e HOSTNAME=bobthebuilder.com
```

## denver inject <stack>

Read env vars one per line from stdin

file - myenv.txt
```
HELLO=world
```

```
$ cat myenv.txt | denver inject myapp
$ denver env myapp docker
```

This would print:

```
-e HELLO=world
```

## license

MIT