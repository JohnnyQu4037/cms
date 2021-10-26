Steps for homework 2:
1. use antd layout to create UI

2. add folders and file for corresponding url

3. beside of "/dashboard/manager/students", all of the other file only return one-line text with description

4. add an Avatar at the end of the header and then attach an onClick event on it.

5. when the event is triggered, get the token from localStorage, if failed, force logout. 
   otherwise, send an async request to the api server. if the response msg is success, logout, otherwise, warn the user.

6. use antd table module to make a table, fetch the data from cms api server after the page content is load. 

7. fill table cells by retrieving data from the response.

8. adding ui elements such as Add_Button and Search_Bar. also config the pagination settings to show page selector.
