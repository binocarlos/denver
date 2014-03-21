package main

import (
  "os"
  "github.com/codegangsta/cli"
)

func main() {
  app := cli.NewApp()
  app.Name = "denver"
  app.Version = "0.0.1"
  app.Usage = "env variables in etcd"
  app.Commands = []cli.Command{
	  {
	    Name:      "ls",
	    ShortName: "l",
	    Usage:     "list the stacks we have an environment for",
	    Action: func(c *cli.Context) {
	      println("tbc")
	    },
	  },
	  {
	    Name:      "get",
	    ShortName: "g",
	    Usage:     "get <stack> <var>",
	    Action: func(c *cli.Context) {
	      println("tbc")
	    },
	  },
	  {
	    Name:      "set",
	    ShortName: "s",
	    Usage:     "set <stack> <var> <value>",
	    Action: func(c *cli.Context) {
	      println("tbc")
	    },
	  },
	  {
	    Name:      "del",
	    ShortName: "d",
	    Usage:     "del <stack> <var>",
	    Action: func(c *cli.Context) {
	      println("tbc")
	    },
	  },
	  {
	    Name:      "env",
	    ShortName: "e",
	    Usage:     "env <stack> <format>",
	    Action: func(c *cli.Context) {
	      println("tbc")
	    },
	  },
	  {
	    Name:      "inject",
	    ShortName: "e",
	    Usage:     "inject <stack>",
	    Action: func(c *cli.Context) {
	      println("tbc")
	    },
	  },
	}


  app.Run(os.Args)
}