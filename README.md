denver
======

Create layers of ENV variables saved to etcd and deploy docker containers using them

## installation

```
$ npm install denver -g
```

## usage

denver will save ENV variables for a stack under a key in etcd.

it will merge stacks in order so one stack can inherit from another.

it will spit out stacks environment in a few useful formats.

## denver ls

List the stack names we have environments for

```bash
$ denver ls
```

## denver rm

Remove a stack from the database

```bash
$ denver rm myapp
```

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

## denver env <stack> <stack>

Print the whole environment for a stack

```bash
$ denver env myapp
```

You can 'merge' several stacks with the env command - this lets you have 'global' envs or whatever:

```bash
$ denver env defaultenv myapp
```

When you merge - the last stack will take precendence - so myapp -> ADMIN_EMAIL would overwrite defaultenv -> ADMIN_EMAIL.

You can merge as many stacks as you want.

## denver docker <stack> <stack>

You can also print the environment in a docker friendly format:

```
$ denver docker defaultenv myapp
```

This would output:

```
-e ADMIN_EMAIL=bob@thebuilder.com -e HOSTNAME=bobthebuilder.com
```

## denver inject <stack>

Read env vars one per line from stdin

file - myenv.txt:

```
HELLO=world
ADMIN_EMAIL=bob@thebuilder.com
```

``` bash
$ cat myenv.txt | denver inject myapp
$ denver env myapp docker
```

This would print:

```
-e HELLO=world -e ADMIN_EMAIL=bob@thebuilder.com
```

## license

MIT