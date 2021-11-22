//todo: table from button
const newPayrollBtn = document.getElementById("NewPayroll");
//console.log(newPayrollBtn);

newPayrollBtn.addEventListener("click", () => {
    const payrollTable = document.getElementById("PayrollTable");
    payrollTable.style.display = "table";
    newPayrollBtn.style.display = "none";
});


//todo: get Data from Json file
//* Employee First & Last Name
//* Hourly Wage

let personalList = [];
//todo: load employees from json
const loadEmployees = async () => { 
    try {
    const res = await fetch("db/employees.json");
    personalList = await res.json();
    // console.log(personalList);

    displayEmployees(personalList);
  } catch (err) {
    console.error(err);
  }
}

//todo: display employees from json to the DOM

const displayEmployees=(employee)=>{
    const employeesTable = employee.map((employee) => {
        return `
        <tr>
           <th scope="col">${employee.id}</th>
            <td>${employee.firstName}</td>
            <td>${employee.lastName}</td>
            <td>R${employee.hw}</td>
            <td><input type="number" class="hours-worked" style="width:60px"  min="0"/> h</td>
            <td class='monthly-pay fw-bold' > </td>
        </tr>

        `
    }).join('');

    document.getElementById("Employees-table").innerHTML = employeesTable;

    monthlyPay();

    //todo: 5+6 Outputs Max, Min & Avg
   // Get Hourly Wage
   const getEmployeesHW = employee.map((employee) => employee.hw);
 
     //todo: Maximum wage
     let maxHW = calcMaxWage(getEmployeesHW);
      document.getElementById("Max-wage").innerText = "R" + maxHW;
    
    //todo: Minimum wage
     let minHW = calcMinWage(getEmployeesHW);
      document.getElementById("Min-wage").innerText = "R" + minHW;

   //todo: Average wage
    const getTotalHW = (total, hw) => total + hw;

    const getAvgHW = (arr) => arr.reduce(getTotalHW, 0) / arr.length;

    let avgHW = getAvgHW(getEmployeesHW).toFixed(2);
    document.getElementById("Avg-wage").innerText = "R" + avgHW;
}

loadEmployees();

function monthlyPay() {
    const hoursWorked = document.querySelectorAll(".hours-worked");
     //console.log(hoursWorked);
    
    hoursWorked.forEach((workHour) => {
        workHour.addEventListener('keyup', (e) => {
            //console.log(e.target);

            if (e.target.value === "" || e.target.value <= 0) {
                return;
            
            } else {
              
                if (e.key === "Enter") {
                    const hour = e.target.value
                    const hourlyWage = Number(
                        e.target.parentElement.parentElement.children[3].innerText.substring(1)
                    );
            
                let monthlyPay = e.target.parentElement.parentElement.children[5];

                    const calcMonthlyPay = (hour * hourlyWage).toFixed(2);        
                    monthlyPay.innerText = "R" + calcMonthlyPay;
                    
                
                //todo: save data
                    saveData(hour);

                // Get Total Payouts
                    getTotalPayouts();
            }
        }
        });
    })
}


//utility functions
//calc maxwage
function calcMaxWage(arr){
    return Math.max(...arr);
}

//calc minwage
function calcMinWage(arr){
    return Math.min(...arr);
}

const calcTotal = (total, num) => {
  return total + num;
};

//function save data
function saveData(hour) {
    let hours;

    if (sessionStorage.getItem("hours") === null) {
    hours = [];
  } else {
    hours = JSON.parse(sessionStorage.getItem("hours"));
    }
    
    hours.push(hour);

    sessionStorage.setItem("hours", JSON.stringify(hours));

    
    const newHours = hours.map((hour) => parseInt(hour));

    let totalHours = newHours.reduce(calcTotal, 0);

    document.getElementById("Total-WH").innerText = totalHours + " h";

}

function getTotalPayouts() {
  const allMonthlyPays = document.querySelectorAll(".monthly-pay");

  let arrayOfPayouts = Array.from(allMonthlyPays);
  // console.log(arrayOfPayouts);

  let newPayout = arrayOfPayouts.map((payout) =>
    parseFloat(payout.innerHTML.substring(1))
  );

  // console.log(newPayout);

  // * Return array elements with values
  newPayout = newPayout.filter((payout) => payout);

  // console.log(newPayout);

  let calculateTotalPay = newPayout.reduce(calcTotal, 0);

  document.getElementById("Total-pay").innerText =
    "R" + calculateTotalPay.toFixed(2);
}