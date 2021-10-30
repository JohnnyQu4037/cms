Steps for homework 3:

1. Add dropdown to the avatar and bind the onClick event to the dropdown menu item.
   Also change the logic of logout so that the account will be logout after the server confirms the request.

2. update the logic about how to receive the data from api, such as page limit and page number in the url

3. Add loading effects by using useState to setup a boolean for isLoading and toggle it on before sending api request and toggle it off when successfully receive the data from the server.

4. add more logic in fetchData() to check if there is an existing query. if so , fetch the data from the api. otherwise, only fetch the data with given page number and page size.

5. use lodash.debounce to create a debounced version of our fetchData() function.

6. use useMemo() to create the memorized value that refer to our debounced function.

7. When there is change in the search bar, the referenced debounced function that created by useMemo will be triggered and fetch the data to the table and the data source of the table will be updated

8. use date-fns to add the literal description of the join time to the list.

9. use the render function in antd table to auto generate the index for id.

10. Add sorter and filter function to the table

11. create a Popconfirm component where an anchor tag handles the onclick trigger. When clicked, Popconfirm ask to verify the action. if confirm, send delete request to the server, otherwise, cancel action.

12. Create a Modal component that sits in the middle of the screen, visible when add button or edit link got clicked. title text change base on which action triggers the Modal

13. reset the visibility, and other states that is related to the next action.

14. add functions to make Modal component interactive