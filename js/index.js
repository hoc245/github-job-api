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
        full_time : "",
        page : 1,
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
        setTimeout(function(){
            $('.job-item').addClass('fadein');
        },500);
    }
    // Delete Job item Element
    function deleteEle() {
        // $('.job-item').removeClass('fadein');
        if ($('.job-item').length !== 0) {
            // $('.job-item').remove();
            $('.job-item').fadeOut(300)
        };
    }
    // Get data from API
    function getList() {
        $.ajax({
            url : `https://jobs.github.com/positions.json?page=${searchObject.page}&description=${searchObject.description}&full_time=${searchObject.full_time}&location=${searchObject.location}`,
            header : {
                "Access-Control-Allow-Origin" : "*",
            },
            headers : {
                // "Access-Control-Allow-Origin" : "http://127.0.0.1:5500",
                // "Content-Type" : "application/json",
                // "Access-Control-Allow-Methods" : "POST, GET, OPTIONS",
                // "Access-Control-Allow-Credentials" : true,
                // "Cache-Control" : "no-cache",
            },
            success : function(data) {
                if (data.length === 0) {
                    $('#job-button').addClass('empty');
                } else {
                    $('#job-button').removeClass('empty');
                    for (let i = 0 ; i < data.length ; i++) {
                        jobListObject.companyAvaUrl = data[i].company_logo;
                        // missing time > add next time
                        jobListObject.jobTitle = data[i].title;
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
        var type = $('#job-type:checked').length === 1 ? "true" : "" ;
        // Add data to search Object
        searchObject.description = searchData.split(" ").join("+");
        searchObject.location = cityData.split(" ").join("+");
        searchObject.full_time = type;
        searchObject.page = 1;
        // Call AJAX
        getList();
    }
    // Call first time when load page
    submitData();
    searchInput.keyup(function(e){
        var keyCode = e.keyCode;
        if (keyCode === 13) {
            deleteEle();
            submitData();
            window.scrollTo(0,0);
        }
    })
    citySearchInput.keyup(function(e){
        var keyCode = e.keyCode;
        if (keyCode === 13) {
            deleteEle();
            submitData();
            window.scrollTo(0,0);
        }
    })
    submitBtn.click(function(){
        deleteEle();
        submitData();
        window.scrollTo(0,0);
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
            searchObject.page = 1;
            $('#job-type:checked').length === 1 ? "true" : "" ;
            getList();
            window.scrollTo(0,0);
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