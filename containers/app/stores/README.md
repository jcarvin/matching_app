# General Stores
###### All stores should be fully observable through mobx so that all changes are immediately reflected throughout the entire aplication.
### MainStore.js
###### This store receives and distributes all of the other stores. 

### UIState.js
###### This store simply holds the current width and height of the window.

### DistributorStore.js
###### This store manages a few things, mostly for the purposes of filtering. 

* `distributorList`
    * Simply put; a list of all of the available distributors
    * A list of Objects (e.g. `{distributor_id: 123, distributor_name: 'CORE-MARK'}`)
    * The list is initialized by the function `getDistributors`
        * `getDistributors` is only used in the constructor.
        * Unlike most other api calls in this app, `getDistributors` is not paginated. It just pulls down all distributors in one shot. 
    * The computed value `distNameList` is derived from `distributorList`
* `distNameList`
    * A computed value that returns a list of Objects (e.g. `{value: 123, label: 'CORE-MARK'}`). This list is extremely similar to `distributorList` but the changes are necessary and the list is used as the `list` prop in the `DropDown` component
* `selectedDistributor`
    * Integer that corresponds with a `distributor_id` 
    * This value drives the `visibleWarehouses`. When this value is changed, `getVisibleWarehouses` is called
* `visibleWarehouses`
    * Another list of Objects (e.g. `{ID: 456, Warehouse: 'CORE-MARK - CAROLINA'}`)
    * This list is replaced any time the `selectedDistributor` is changed. Only warehouses that correspond with the `selectedDistributor` are shown.
    * This list is used as the `list` prop in a few `ScrollList` components.
* `selectedWarehouses`
    * A list of Objects that look identical to the Objects in `visibleWarehouses`.
    * These are not tied to the `selectedDistributor`. They are controlled by `visibleWarehousesOnClick`, `shiftSelect`, `ctrlSelect`, and `selectAllVis`
    * This list is used as the `list` prop in a few `ScrollList` components. Typically right next to `ScrollList`s containing `visibleWarehouses`
* Selection Handlers
    * `visibleWarehousesOnClick`
        * Handles single Click
        * Accepts an object from `visibleWarehouses` and pushes the whole object to the `selectedWarehouses` list.
        * Checks to see if the object is already in `selectedWarehouses`. If it is, it removes the object from the list.
    * `shiftSelect`
        * Handles when a user clicks on a starting row, holds the `shift` button, and clicks another row.
        * Accepts a list that consists of all the warehouse objects in between and including the start and end warehouses. 
        * Preforms some checks to ensure no duplicates are added to `selectedWarehouses` and pushes each object in the list to `selectedWarehouses`
    * `ctrlSelect`
        * In this store, `ctrlSelect` does the same thing as `visibleWarehousesOnClick`
    * `selectAllVis`
        * This is called when a user clicks the label on the `ScrollList`. 
        * All `visibleWarehouses` are added to the `selectedWarehouses` list.
    * `selectedWarehousesOnClick`
        * Removes the warehouse that was clicked from `selectedWarehouses`
        * Calls `filterOnWarehouse()` to ensure that the active warehouse filters are accurate. This was put in place to iron out some odd bugs. 
    * `removeAllSelected`
        * Similar to `selectAllVis`, `removeAllSelected` is called when a user clicks the label of the appropriate `ScrollList`.
        * As you may imagine, `removeAllSelected` removes all of the warehouses from the `selectedWarehouses` list
    