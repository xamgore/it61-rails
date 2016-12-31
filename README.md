# It61

## Development setup

1. Clone repo
2. Install postgresql and create super user in it (matching your OS user name)
3. Install gems
    
    `bundle update`

4. Install `overcommit` for GIT commit hooks
5. Install GIT hooks with `overcommit`: 
    
    ```
    overcommit --install -f
    ```
    
6. Run `overcommit --sign` to trust the hooks in this repository.
7. Setup database and run migrations
    
    ```
    rails db:create db:migrate
    ```
8. Install bower (if not yet) and download js libs
    
    ```
    npm install -g bower
    bower install
    ```
    
9. Run server
    `bundle exec rails server`

## Guidelines

Use the following guides for getting things done, programming well, and
programming in style.

* [Protocol](http://github.com/thoughtbot/guides/blob/master/protocol)
* [Best Practices](http://github.com/thoughtbot/guides/blob/master/best-practices)
* [Style](http://github.com/thoughtbot/guides/blob/master/style)
