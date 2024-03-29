function NewEmailVacationGrant(emailApi, histories, addresses, payroll) {
    // Assumption:
    // - histories.length == addresses.length == payroll.length
    // create hash maps for addresses and payroll; this removes the need to
    // use the slow, linear Array.find() method
    var mappedAddresses = [];
    for (var i = 0; i < addresses.length; i++) {
        mappedAddresses[addresses[i].empNo] = Object.assign({}, addresses[i]);
    }
    var mappedPayroll = [];
    for (var i = 0; i < payroll.length; i++) {
        mappedPayroll[payroll[i].empNo] = Object.assign({}, payroll[i]);
    }
    for (var i = 0; i < histories.length; i++) {
        var employee = histories[i];
        var address = mappedAddresses[employee.empNo];
        var newVacationBalance = employee.yearsEmployed + mappedPayroll[employee.empNo].vacationDays;
        emailApi.sendEmail(address.email, `Dear ${employee.name},\n` +
            `Based on your ${employee.yearsEmployed} years of employment, you have been granted ${employee.yearsEmployed} bonus days of vacation, bringing your total to ${newVacationBalance}.`);
    }
}
function OldEmailVacationGrant(emailApi, histories, addresses, payroll) {
    for (var i = 0; i < histories.length; i++) {
        let employee = histories[i];
        let address = addresses.find(x => x.empNo == employee.empNo);
        let employeePayroll = payroll.find(x => x.empNo == employee.empNo);
        let newVacationBalance = employee.yearsEmployed + employeePayroll.vacationDays;
        emailApi.sendEmail(address.email, `Dear ${employee.name}\n` +
            `based on your ${employee.yearsEmployed} years of employment, you have been granted ${employee.yearsEmployed} days of vacation, bringing your total to ${newVacationBalance}`);
    }
}
(function CompareOldVSNew() {
    // generate dummy data for testing
    var payroll = [];
    var addressBook = [];
    var workHistory = [];
    for (var i = 0; i < 10000; i++) {
        var empNo = Math.floor((Math.random() * 10000000)).toString();
        payroll.push({
            empNo: empNo,
            vacationDays: 10 // default starting point
        });
        addressBook.push({
            empNo: empNo,
            email: 'foo@' + empNo + '.com'
        });
        workHistory.push({
            empNo: empNo,
            name: 'Bar ' + empNo,
            yearsEmployed: Math.floor(Math.random() * 15) + 1 // 1-15 years
        });
    }
    // dummy EmailClient
    class EmailClient {
        sendEmail(email, body) {
            // console.log("Sending email to: " + email + ".\n");
            // console.log(body + "\n");
        }
    }
    var emailClient = new EmailClient();
    var newAverage = 0;
    var oldAverage = 0;
    var sampleRuns = 10;
    for (var i = 0; i < sampleRuns; i++) {
        const newStart = Date.now();
        NewEmailVacationGrant(emailClient, workHistory, addressBook, payroll);
        newAverage += Date.now() - newStart;
        const oldStart = Date.now();
        OldEmailVacationGrant(emailClient, workHistory, addressBook, payroll);
        oldAverage += Date.now() - oldStart;
    }
    console.log('Average runtime of new implementation: ' + (newAverage / sampleRuns).toString() + 'ms.');
    console.log('Average runtime of old implementation: ' + (oldAverage / sampleRuns).toString() + 'ms.');
})();
