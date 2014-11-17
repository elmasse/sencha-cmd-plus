# Sencha Cmd Plus

An experiment to run the right sencha cmd version based on the current `./.sencha/{app|workspace}/sencha.cfg` file

This is just a wrapper for `sencha` so you can use it transparently, just change `sencha` by `cmd-plus` and boom!


## Install

Just install cmd-plus as a global module (by now is only available from github repo):

```
sudo npm install -g git://github.com/elmasse/sencha-cmd-plus.git
```

You need to have the same cmd version installed (in this version in the default installation folder).

You can check your installed versions with:

```
cmd-plus list
```

running any other sencha cmd command is transparently:

```
cmd-plus which
```

This will execute the current installed `sencha which` command. But, if you are under an sencha touch / extjs root app folder it will read the ./.sencha/app/sencha.cfg file and use the cmd version from it to localize the right version.
