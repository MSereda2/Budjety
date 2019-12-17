/*  BUDGET CONTROLLER */
var budgetController = (function() {

  class Expence {
    constructor(id,description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
  };

  class Income {
    constructor(id,description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
  };

  var calculateTotal = function(type) {
      var sum = 0;
      data.allItems[type].forEach(function(current) {
          sum = sum + current.value;
      });

      data.totals[type] = sum;
  }

  var data = {
      allItems: {
          exp: [],
          inc: []
        },
      totals: {
          exp: 0,
          inc: 0
        },
       budget: 0,
       precenteg: -1
  };
  

  return {
      addItem: function(type,des,value) {
            var newItem, id;

            // Create new id
            if(data.allItems[type].length > 0) {
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }

            // Create new item based on `inc` or `exp`
            if (type === `exp`) {
                newItem = new Expence(id,des,value);
            } else if (type === `inc` ) {
                newItem = new Income(id,des,value);
            }

            // Push new item to data structure
            data.allItems[type].push(newItem);
            return newItem;
           
      },

      deleteItem: function(id,type) {
           var ids = data.allItems[type].map(function(current) {
              return current.id // loop over array and select all id
            });

            var index = ids.indexOf(id);
            console.log(index)

            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }
      },

      calculateBudget: function(newItem) {
          // Calculate total income or expence
            calculateTotal(`exp`);
            calculateTotal(`inc`);
          // Calculate buddget: income - expence
            data.budget = data.totals.inc - data.totals.exp;
          // Calculate the precenteg
            if(data.totals.inc > 0) {
                data.precenteg = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.precenteg = -1;
            }
           
      },

      getBudget: function() {
          return {
              budget: data.budget,
              totalInc: data.totals.inc,
              totalExp: data.totals.exp,
              precenteg: data.precenteg
          }
      },

      testing: function() {
          console.log(data);
      }
  }
  
})();


/*  UI CONTROLLER */
var UIcontroller = (function() {

  
    
    var DOMstrings = {
        inputType: `.add__type`,
        inputdescription: `.add__description`,
        inputValue: `.add__value`,
        addBtn: `.add__btn`,
        incomeContainer: `.income__list`,
        ExpenceContainer: `.expenses__list`,
        budgetValue: `.budget__value`,
        totalInc: `.budget__income--value`,
        totalExp: `.budget__expenses--value`,
        precented: `.budget__expenses--percentage`,
        container: `.container`
    }

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,  // either + or -
                description: document.querySelector(DOMstrings.inputdescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value) 
            }
        },

        getDOMstrings: function() {
            return DOMstrings;
        },

        addListItem: function(obj,type) {
            var html, element;
            // Create HTML string with placeholder text and replace to actual data
            if(type === `inc`) {
                element = DOMstrings.incomeContainer;
                html = ` <div class="item clearfix" id="inc-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right clearfix">
                    <div class="item__value">+ ${obj.value}</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
                </div>`;
            } else if(type === `exp`) {
                element = DOMstrings.ExpenceContainer;
                html = ` <div class="item clearfix" id="exp-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right clearfix">
                    <div class="item__value">- ${obj.value}</div>
                    <div class="item__percentage">21%</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
                </div>`;
            };

            // Insert the HTML into dom
            document.querySelector(element).insertAdjacentHTML(`beforeend`, html);
        },

        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el)
        },

        clearInput: function() {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputdescription + `, ` + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields); // this line of code convert list to array

            fieldsArr.forEach(function(current, index, array) { // forEach has 3 parametrs for loop !!Current means element which is proseed right now a
                current.value = ""; // this line loop over our 2 elements and set to them value to empty
            });

            fieldsArr[0].focus();
        },

        updateBudget: function(data) {
            //1. Select DOM elements which we want to replace
            document.querySelector(DOMstrings.budgetValue).textContent = data.budget;
            document.querySelector(DOMstrings.totalExp).textContent = data.totalExp;
            document.querySelector(DOMstrings.totalInc).textContent = data.totalInc;

            if(data.totalInc > 0) {
                document.querySelector(DOMstrings.precented).textContent = data.precenteg + " %";
            } else {
                document.querySelector(DOMstrings.precented).textContent = 0;

            }
        }
    }
})();

/*  APP CONTROLLER */
var appController = (function(budgetCtrl, UICtrl) {
   ;

    var setupEventListeners = function() {       
        var DOM = UICtrl.getDOMstrings(); // this only contains dom element offevent listener
        document.querySelector(DOM.addBtn).addEventListener(`click`, ctrlAddItem);

        document.addEventListener(`keypress`, function(event) {
            if(event.keyCode === 13) {
              ctrlAddItem();
            } 
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function () {
        //1. Calculate the budget
        budgetCtrl.calculateBudget();

        //2. Return budget
        var budget = budgetCtrl.getBudget();
        console.log(budget);
        //2. Display budget
        UICtrl.updateBudget(budget);
    };

    var updatePercentages = function() {
        // 1. Calculate percentages

        // 2. Read from our budget controller 

        // 3. Update UI
    };
   
    var ctrlAddItem = function() { /// call back
        //1. Get the filed input data
        var input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2. Add the item to the budget controller  
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
  
            //3. Add the item to the UI
            UICtrl.addListItem(newItem,input.type);

            //4. Clear the fields
            UICtrl.clearInput();

            //5. Calculate and update budget
            updateBudget();
        } else {
            alert(`write correct data`)
        }
    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, id;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID) {
            splitID = itemID.split(`-`);
            type = splitID[0];
            id = parseInt(splitID[1]) ;
        }

        //1. Delete item from our data structure
        budgetCtrl.deleteItem(id,type)
        //2. Delete item from UI
        UICtrl.deleteListItem(itemID)

        //3. Update budget
        updateBudget();
    };

    return {
        init: function() {
            console.log(`app has started`);
            setupEventListeners();
            UICtrl.updateBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                precenteg: 0
            })
        }
    };

})(budgetController, UIcontroller);

appController.init();