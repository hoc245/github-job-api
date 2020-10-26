// *** NAV ***
const toggleSwitch = document.getElementById('theme-switch');
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme',currentTheme);
    if (currentTheme === "dark") {
        toggleSwitch.checked = true;
    } else {
        toggleSwitch.checked = false;
    }
}
toggleSwitch.onclick = function() {
    if (!toggleSwitch.checked) {
        document.documentElement.setAttribute('data-theme','light')
        localStorage.setItem('theme','light');
    } else {
        document.documentElement.setAttribute('data-theme','dark')
        localStorage.setItem('theme','dark');
    }
}

// *** MAIN ***
const jobList = $('#job-list');
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
        full_time : "on",
        page : 1,
        currentJobsShow : 0,
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
        companyAva.onerror = function() {
            this.src = "https://cdn.logo.com/hotlink-ok/logo-social.png";
        }
        jobTime.innerHTML = jobListObject.jobTime + " + " + jobListObject.jobType;
        jobTitle.innerHTML = jobListObject.jobTitle;
        jobCompany.innerHTML = jobListObject.jobCompany;
        jobAddress.innerHTML = jobListObject.jobAddress;
        // Add class, attribute...
        jobItem.classList.add('job-item');
        jobItem.classList.add('random-color');
        jobItem.setAttribute('onclick','moreDetail(this)');
        companyAva.setAttribute('alt','job-ava-image');
        jobAva.classList.add('job-ava');
        jobAddress.classList.add('job-address');
        jobCompany.classList.add('job-company');
        jobTitle.classList.add('job-title');
        jobTime.classList.add('job-time');
        // Add new element to main DOM
        jobAva.appendChild(companyAva);
        jobItem.append(jobAva,jobTime,jobTitle,jobCompany,jobAddress);
        jobList.append(jobItem);
        setTimeout(function() {
            $('.job-item').addClass('fadein')
        },300);
    }
    // Delete Job item Element
    function deleteEle() {
        $('.job-item').removeClass('fadein');
        if ($('.job-item').length !== 0) {
            setTimeout(function() {
                $('.job-item').remove();
            },500);
        };
    }
    // Get data from API
    function getList() {
        $.ajax({
            url : "https://jobs.github.com/positions.json?",
            data : {
                description : searchObject.description,
                location : searchObject.location,
                full_time : searchObject.full_time,
                page : searchObject.page,
            },
            success : function(data) {
                $('#total-job').html("");
                var date = new Date();
                var currentTime = Date.parse(date.toUTCString());
                if (data.length === 0) {
                    $('#job-button').addClass('empty');
                } else {
                    $('#total-job').html(`Showing 1 of ${data.length + searchObject.currentJobsShow} jobs`);
                    searchObject.currentJobsShow += data.length;
                    $('#total-job').addClass('active');
                    $('#job-button').removeClass('empty');
                    for (let i = 0 ; i < data.length ; i++) {
                        var jobTime = Date.parse(data[i].created_at);
                        var time = (currentTime - jobTime)/1000/60/60 < 1 ? `${Math.round((currentTime - jobTime)/1000/60)}mins` : (currentTime - jobTime)/1000/60/60 > 24 ? `${Math.round((currentTime - jobTime)/1000/60/60/24)}days` : `${Math.round((currentTime - jobTime)/1000/60/60)}h`;
                        jobListObject.companyAvaUrl = data[i].company_logo;
                        jobListObject.jobTitle = data[i].title;
                        jobListObject.jobTime = `${time} ago`;
                        jobListObject.jobCompany = data[i].company;
                        jobListObject.jobAddress = data[i].location;
                        jobListObject.jobType = data[i].type;
                        searchInput.val("");
                        citySearchInput.val("");
                        createELe();
                        fadeInOnScroll();
                    }
                }
            },
        })
    }
    // INPUT
    const searchInput = $('#name-search');
    const citySearchInput = $('#country-search');
    const submitBtn = $('#nav-form-btn');

    function submitData() {
        var searchData = searchInput.val();
        var cityData = citySearchInput.val();
        var type = $('#job-type:checked').length === 1 ? "on" : "" ;
        $('#total-job').removeClass('active');
        // Add data to search Object
        searchObject.description = searchData.split(" ").join("+");
        searchObject.location = cityData.split(" ").join("+");
        searchObject.full_time = type;
        searchObject.page = 1;
        searchObject.currentJobsShow = 0;
        // Call AJAX
        getList();
    }
    // Call first time when load page
    submitData();
    searchInput.keyup(function(e){
        var keyCode = e.keyCode;
        if (keyCode === 13) {
            deleteEle();
            setTimeout(function(){
                submitData();
                window.scrollTo(0,0);
            },500);
        }
    })
    citySearchInput.keyup(function(e){
        var keyCode = e.keyCode;
        if (keyCode === 13) {
            deleteEle();
            setTimeout(function(){
                submitData();
                window.scrollTo(0,0);
            },500);
        }
    })
    submitBtn.click(function(){
        deleteEle();
        setTimeout(function(){
            submitData();
            window.scrollTo(0,0);
        },500);
    })

    // Loadmore button
    const loadmoreBtn = $('#loadmore');
    loadmoreBtn.click(function(){
        searchObject.page += 1;
        getList();
    })
    // Job Type Checkbox
    const jobTypeBtn = $('.job-type');
    jobTypeBtn.click(function(){
        if ($('.job-item').length !== 0) {
            deleteEle();
            searchObject.currentJobsShow = 0;
            setTimeout(function(){
                searchObject.page = 1;
                $('#job-type:checked').length === 1 ? "on" : "" ;
                getList();
                window.scrollTo(0,0);
            },500);
        }
    })
    // Add animation
    window.onscroll = function(){
        fadeInOnScroll();
    }
    // Hide element under scroll
    function fadeInOnScroll() {
        var item = document.getElementsByClassName('job-item');
        var screenHeight = window.innerHeight;
        for (let i = 0 ; i < item.length ; i++ ) {
            var currentScroll = window.scrollY;
            if (item[i].offsetTop > (currentScroll + screenHeight)) {
                item[i].classList.remove('fadein');
            } else {
                item[i].classList.add('fadein');
            }
        }
    }