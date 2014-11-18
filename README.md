# Sencha Cmd Plus

An experiment to run the right sencha cmd version based on the current `./.sencha/{app|workspace}/sencha.cfg` file

This is just a wrapper for `sencha` so you can use it transparently, just change `sencha` by `cmd-plus` and boom!


## Install

Just install cmd-plus as a global module (by now is only available from github repo):

```
$ sudo npm install -g git://github.com/elmasse/sencha-cmd-plus.git
```

You need to have the same cmd version installed (in this version in the default installation folder).

## Usage

### list
You can check your installed versions with:

```
$ cmd-plus list
4.0.0.161
4.0.3.74
4.0.4.84
5.0.0.114
5.0.0.160
5.0.1.231
5.0.2.274
5.0.3.324
```

### use [version] {sencha cmd options}
This will generate a new app using cmd version 4.0.4.84

```
$ cmd-plus use 4.0.4.84 -sdk ../touch-2.4.0 generate app MyApp MyApp
```

### sencha
Running any other sencha cmd command is transparent:

```
$ cmd-plus which
```

This will execute the current installed `sencha which` command. But, if you are under a sencha touch / extjs root app folder it will read the ./.sencha/app/sencha.cfg file and use the cmd version from it. If it is not installed it will default to the latest version.
