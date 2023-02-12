scp dist/js/*.js ylgy_server:y/acapp/
scp dist/css/*.css ylgy_server:y/acapp/

ssh ylgy_server 'cd y/acapp && ./rename.sh'
