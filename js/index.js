// *** MAIN ***
const jobList = document.getElementById('job-list');
    // Create Job item Element
    // Object contain data for job item
    var jobListObject = {
        companyAvaUrl : "",
        jobTime : "",
        jobType : "",
        jobTitle : "",
        jobCompany : "",
        jobAddress : "",
    }
    // Object contain data for search
    var searchObject = {
        description : "",
        location : "",
        full_time : "",
        page : "0",
    }
    function createELe() {
        // create
        var jobItem = document.createElement('div');
        var jobAddress = document.createElement("p");
        var jobCompany = document.createElement("p");
        var jobTitle = document.createElement("p");
        var jobTime = document.createElement("p");
        var companyAva = document.createElement("img");
        var jobAva = document.createElement("span");
        // Add content to new ele
        companyAva.setAttribute('src',jobListObject.companyAvaUrl);
        jobTime.innerHTML = jobListObject.jobTime + " + " + jobListObject.jobType;
        jobTitle.innerHTML = jobListObject.jobTitle;
        jobCompany.innerHTML = jobListObject.jobCompany;
        jobAddress.innerHTML = jobListObject.jobAddress;
        // Add class, attribute...
        jobItem.classList.add('job-item');
        companyAva.setAttribute('alt','job-ava-image');
        jobAva.classList.add('job-ava');
        jobAddress.classList.add('job-address');
        jobCompany.classList.add('job-company');
        jobTitle.classList.add('job-title');
        jobTime.classList.add('job-time');
        // Add new element to main DOM
        jobAva.appendChild(companyAva);
        jobItem.append(jobAva,jobTime,jobTitle,jobCompany,jobAddress);
        jobList.appendChild(jobItem);
    }
    // Delete Job item Element
    function deleteEle() {
        $('.job-item').remove();
    }
    // Get data from API
    function getList() {
        $.ajax({
            url : `https://jobs.github.com/positions.json?description=${searchObject.description}&full_time=${searchObject.full_time}&location=${searchObject.location}`,
            success : function(data) {
                console.log(data);
            }
        })
    }
    // INPUT
    const searchInput = $('#name-search');
    const citySearchInput = $('#country-search');
    const submitBtn = $('#nav-form-btn');

    function submitData() {
        var searchData = searchInput.val();
        var cityData = citySearchInput.val();
        var type = $('#job-type:checked').length === 1 ? "true" : "" ;
        // Add data to search Object
        searchObject.description = searchData.split(" ").join("+");
        searchObject.location = cityData.split(" ").join("+");
        searchObject.full_time = type;
        // Call AJAX
        getList();
    }

    searchInput.keyup(function(e){
        var keyCode = e.keyCode;
        if (keyCode === 13) {
            submitData();
        }
    })

    submitBtn.click(function(){
        submitData();
    })

