// ======================================== Variables & Constants Statrs =======================================

var BASE_URL = 'http://uninamaapi.azurewebsites.net/';
//var BASE_URL = 'http://localhost:60774/';
var IMAGE_BASE_URL = BASE_URL + 'UploadedImages/';

var URL_SPLIT = 'AdminPanel/';

var LOGGED_IN_USER_INFO = 'UninamaLoggedInUserInfo';

var LOGIN_VALIDATION = 'api/LoginValidation/LoginValidation';
var INSERT_UNIVERSITY = 'api/data/AddUniversity';
var INSERT_DEGREE = 'api/data/AddDegree?';
var INSERT_NEW_DEGREE = 'api/data/AddNewDegree?';
var INSERT_DISCIPLINE = 'api/data/AddDiscipline?';
var INSERT_COURSE = 'api/data/AddCourse?';
var INSERT_NEW_COURSE = 'api/data/AddNewCourse?';
var GET_ALL_UNIVERSITIES = 'api/data/GetAllUniversities';
var GET_ALL_DISCIPLINES = 'api/data/GetAllDiscipline';
var GET_ALL_DEGREES_BY_UNIIVERSITY_ID = 'api/data/GetAllDegreesByUniversityID?';
var GET_UNIVERSITIES_WITHOUT_PAGES = 'api/university/GetUniversitiesWithoutPages';
var GET_ALL_COURSES = 'api/data/GetAllCourses';
var GET_ALL_USER = 'api/data/GetAllUser';
var GET_ALL_DEGREES = 'api/data/GetAllDegrees';
var INSERT_PAGE = 'api/university/AddPage?';
var SEARCH_IF_UNIVERSITY_EXISTS = 'api/data/SearchUniversityByName?';
var SEARCH_IF_DISCIPLINE_EXITS = 'api/data/SearchDisciplineByName?';
var SEARCH_IF_COURSE_EXITS = 'api/data/SearchCourseByName?';
var SEARCH_IF_DEGREE_EXITS = 'api/data/SearchDegreeByName?';

var globalUniversitiesArray = Array();
var globalUniversitiesWithoutPagesArray = new Array();
var globalDegreeArray = Array();
var globalAllDegreeArray = Array();
var globalDisciplineArray = Array();
var globalCourseArray = Array();
// ======================================== Classes =======================================

function LoginData(userEmailOrUsername, userPassword, userTypeId) {
    this.userEmailOrUsername = userEmailOrUsername;
    this.userPassword = userPassword;
    this.userTypeId = userTypeId;
}

function UniversityData(UniversityName, Abbreviation, Email, ContactNo, Street, City, State, Ranking, TotalStudents, MaleStudentRatio, FemaleStudentRatio, LandArea, Description) {
    this.UniversityName = UniversityName;
    this.Abbreviation = Abbreviation;
    this.Email = Email;
    this.ContactNo = ContactNo;
    this.Street = Street;
    this.City = City;
    this.State = State;
    this.Ranking = Ranking;
    this.TotalStudents = TotalStudents;
    this.MaleStudentRatio = MaleStudentRatio;
    this.FemaleStudentRatio = FemaleStudentRatio;
    this.LandArea = LandArea;
    this.Description = Description;

}

function DegreeData(uniID, disciplineID, degreeID, creditHour, totalFee) {
    this.uniID = uniID;
    this.disciplineID = disciplineID;
    this.degreeID = degreeID;
    this.creditHour = creditHour;
    this.totalFee = totalFee;

}

function DisciplineData(disciplineName) {
    this.disciplineName = disciplineName;
}

function CourseData(uniID, degreeID, courseName) {
    this.uniID = uniID;
    this.degreeID = degreeID;
    this.courseName = courseName;
}

// ======================================== Variables & Constants Ends =======================================
//*************************************************************************************************************
// ======================================== AutoStart Function Starts =======================================
if (window.location.href.split(URL_SPLIT)[1].split("?")[0] == 'admin-portal.html' || window.location.href.split(URL_SPLIT)[1].split("#")[0] == 'admin-portal.html' || window.location.href.split(URL_SPLIT)[1].split("#")[0] == 'admin-portal.html' || window.location.href.split(URL_SPLIT)[1] == 'admin-portal.html' || window.location.href.split(URL_SPLIT)[1] == '' || window.location.href.split(URL_SPLIT)[1] == null) {
    //LoadBodyContentOnClick(GetCurrentPageLoadedStoreInSession());
    //UpdateActiveClass();
}
// ======================================== AutoStart Function Ends ==========================================
//*************************************************************************************************************
// ========================================== Custom Functions Starts ========================================

function LoadBodyContentOnClick(pageName, callbackfunction) {

    if (pageName != "" && pageName != null) {
        $('head').append('<link rel="stylesheet" href="css/theme-default.css" type="text/css" />');

        $("#MainBodyContent").load(pageName, function() {
            if (pageName == 'course.html') {
                GetAllUniversities(true);
                GetAllCourses(true);
                //getDegrees(true);



            } else if (pageName == 'university.html') {
                //GetAllUniversities(false);

            } else if (pageName == 'degree.html') {
                GetAllUniversities(true);
                GetAllDisciplines(true);
                GetAllDegrees(true);


            } else if (pageName == 'discipline.html') {
                GetAllDisciplines(true);

            } else if (pageName == 'newCourse.html') {
                GetAllCourses(true);
            } else if (pageName == 'newDegree.html') {
                GetAllDegrees(false);
            } else if (pageName == 'createePage.html') {
                GetUniversitiesWithoutPages(true);

            }



            ReloadJavascripts();

            if (callbackfunction) {
                callbackfunction();
            }

        });
    }
}

// ========================================== Custom Functions Ends ===========================================
//*************************************************************************************************************
// =========================================== Get Data From Database Functions Starts ========================


function GetUsers() {

    $('#ResponseDiv').html('<center><p class="alert alert-info"><strong>Loading...</strong></p></center>');

    jQuery.support.cors = true;
    $.ajax({
        url: BASE_URL + GET_USERS,
        type: 'GET',
        contenttype: "application/json; charset=utf-8",
        success: function(data) {
            if (data.length > 0) {
                globalUsersArray = data;
                SetDataToViewUsersTable();
            } else {
                $('#ResponseDiv').html('<center><p class="alert alert-danger"><strong>Error!</strong> No Data Found.</p></center>');
            }
        },
        error: function() {
            $('#ResponseDiv').html('<center><p class="alert alert-danger"><strong>Server Error!</strong> Something wrong with the server.</p></center>');
        }
    });
}

// ========================================== Get Data From Database Functions Ends ============================
//************************************************************************************************************
// =========================================== Login Validation Functions Starts =============================
function UserLogin() {

    var usernameOrEmail = $('#login-email-or-username').val().toLowerCase();
    var password = $.md5($('#login-password').val());
    var utid = 1;

    LoginValidation(usernameOrEmail, password, utid);
}

function LoginValidation(usernameOrEmail, password, utid) {

    $('#ResponseDiv').html('<center> <h4 class="alert alert-info"><strong>Loading...</strong></h4> </center>');

    if ((usernameOrEmail != null && usernameOrEmail != "") && (password != null && password != "")) {

        var loginObj = new LoginData(usernameOrEmail, password, utid);

        $.ajax({
            url: BASE_URL + LOGIN_VALIDATION,
            type: 'post',
            data: loginObj,
            contenttype: "application/json; charset=utf-8",
            dataType: 'json',
            crossDomain: true,
            async: true,
            success: function(data) {
                if (data.length > 0) {
                    var loggedInUserInfo = new UserData(data[0].UserID, data[0].UserFirstName, data[0].UserLastName, data[0].Username, data[0].UserEmail, data[0].UserPassword, data[0].UserContactNumber, data[0].UserTypeID, data[0].UserType);
                    StoredLoggedInUserInfo(loggedInUserInfo);
                    $('#ResponseDiv').html('<center> <h4 class="alert alert-success"><strong>SUCCESS!</strong> LoggedIn Successfully!</h4> </center>');
                    setTimeout(function() {
                        window.location.assign("admin-portal.html");
                    }, 1000);
                } else {
                    $('#ResponseDiv').html('<center> <h4 class="alert alert-danger"><strong>ERROR!</strong> Invalid E-Mail/Username or Password!</h4> </center>');
                }
            },
            error: function() {
                $('#ResponseDiv').html('<center> <h4 class="alert alert-danger"><strong>ERROR!</strong> Server Error! Contact SERVER Administrator ASAP!</h4> </center>');
            }
        });
    } else {
        $('#ResponseDiv').html('<center> <h4 class="alert alert-danger"><strong>ERROR!</strong> Fields can not be Empty!</h4> </center>');
    }
}

// =========================================== Login Validation Functions Ends ================================
//*************************************************************************************************************
// =========================================== Custom Function Starts =========================================

function AddUniversity() {

    var UniversityName = $('#UniName').val();
    var Abbreviation = $('#Abb').val();
    var Email = $('#Email').val();
    var ContactNo = $('#ContactNo').val();
    // var Address = $('#Address').val();
    var Street = $('#Street').val();
    var City = $('#City').val();
    var State = $('#State').val();
    var Rank = $('#Rank').val();
    var TotalStudents = $('#TotalStd').val();
    var MaleStudentRatio = $('#MaleRatio').val();
    var FemaleStudentRatio = $('#FemaleRatio').val();
    var LandArea = $('#LandArea').val();
    var Description = $('#Description').val();

    if ((UniversityName != '' && UniversityName != null && UniversityName != undefined) && (Email != '' && Email != null && Email != undefined) && (ContactNo != '' && ContactNo != null && ContactNo != undefined) && (Street != '' && Street != null && Street != undefined) && (City != '' && City != null && City != undefined) && (State != '' && State != null && State != undefined)) {
        if (validateEmail(Email)) {

            if (SearchIfUniversityExist(UniversityName)) {
                var uniObj = new UniversityData(UniversityName, Abbreviation, Email, ContactNo, Street, City, State, Rank, TotalStudents, MaleStudentRatio, FemaleStudentRatio, LandArea, Description);

                $.ajax({
                    url: BASE_URL + INSERT_UNIVERSITY,
                    type: 'post',
                    data: uniObj,
                    contenttype: "application/json; charset=utf-8",
                    success: function(data) {
                        $('#ResponseDiv').html('<center><p class="alert alert-success"><strong>SUCCESS!</strong> Successfully Added.</p></center>');
                        setTimeout(function() {
                            LoadBodyContentOnClick('university.html');
                        }, 2000);
                    },
                    error: function() {
                        $('#ResponseDiv').html('<center><p class="alert alert-danger"><strong>ERROR!</strong> Server Error.</p></center>');
                    }
                });
            } else {
                $('#ResponseDiv').html('<center><p class="alert alert-danger"><strong>ERROR!</strong> University with this name already exist.</p></center>');
            }
        } else {
            $('#ResponseDiv').html('<center><p class="alert alert-danger"><strong>ERROR!</strong> E-Mail is Incorrect.</p></center>');
        }
    } else {
        $('#ResponseDiv').html('<center><p class="alert alert-danger"><strong>ERROR!</strong> Mandatory Fields can not be empty.</p></center>');
    }

}


function AddDegree() {
    var uniID = $('#uniID').val();
    var disciplineID = $('#disciplineID').val();
    var degreeID = $('#degreeID').val();
    var creditHour = $('#creditHour').val();
    var totalFee = $('#totalFee').val();
    if ((uniID != '' && uniID != null && uniID != undefined) && (disciplineID != '' && disciplineID != null && disciplineID != undefined) && (degreeID != -1) && (creditHour != '' && creditHour != null && creditHour != undefined) && (totalFee != '' && totalFee != null && totalFee != undefined)) {
        $.ajax({
            url: BASE_URL + GET_ALL_DEGREES_BY_UNIIVERSITY_ID + 'id=' + uniID,
            type: 'get',
            // data: ,
            contenttype: "application/json; charset=utf-8",
            success: function(data) { //initiliazing global array of degree
                console.log(data);
                globalDegreeArray = data;
                //SetDegreesDropdown(true);


                var degreeObj = new DegreeData(uniID, disciplineID, degreeID, creditHour, totalFee);
                $.ajax({
                    url: BASE_URL + INSERT_DEGREE,
                    type: 'post',
                    data: degreeObj,
                    contenttype: "application/json; charset=utf-8",
                    dataType: 'json',
                    crossDomain: true,
                    async: true,
                    success: function(data) {
                        if (data == 1) {
                            $('#ResponseDiv').html('<center><p class="alert alert-success"><strong>SUCCESS!</strong> Successfully Added.</p></center>');
                            setTimeout(function() {
                                LoadBodyContentOnClick('degree.html');
                            }, 2000);

                        } else {
                            $('#ResponseDiv').html('<center><p class="alert alert-danger"><strong>ERROR!</strong> Already Added.</p></center>');


                        }


                    },
                    error: function() {
                        $('#ResponseDiv').html('<center><p class="alert alert-danger"><strong>ERROR!</strong> Server Error.</p></center>');

                    }
                });


            },
            error: function(data) {
                console.log(data);
            }
        });

    } else {
        $('#ResponseDiv').html('<center><p class="alert alert-danger"><strong>ERROR!</strong> Server Error</p></center>');
    }


}

function AddDiscipline() {
    var disciplineName = $('#disciplineName').val();

    if ((disciplineName != '' && disciplineName != null && disciplineName != undefined)) {
        //   var disciplineObj = new DisciplineData(disciplineName);
        if (SearchIfDisciplineExits(disciplineName)) {

            $.ajax({
                url: BASE_URL + INSERT_DISCIPLINE + 'Discipline=' + disciplineName,
                type: 'get',
                //data: disciplineObj,
                contenttype: "application/json; charset=utf-8",
                dataType: 'json',
                crossDomain: true,
                async: true,
                success: function(data) {
                    $('#ResponseDiv').html('<center><p class="alert alert-success"><strong>SUCCESS!</strong> Successfully Added.</p></center>');
                    setTimeout(function() {
                        LoadBodyContentOnClick('discipline.html');
                    }, 2000);

                },
                error: function() {
                    $('#ResponseDiv').html('<center><p class="alert alert-danger"><strong>ERROR!</strong> Server Error.</p></center>');

                }
            });
        } else {
            $('#ResponseDiv').html('<center><p class="alert alert-danger"><strong>ERROR!</strong> Discipline with this Name already Exits.</p></center>');

        }
    } else {
        $('#ResponseDiv').html('<center><p class="alert alert-danger"><strong>ERROR!</strong> Server Error.</p></center>');
    }
}

function AddCourse() {

    // var uniID = $('#uniID').val();
    var degreeID = $('#degreeID').val(); //unversity degree id
    var courseID = $('#courseName').val();

    if ((degreeID != '' && degreeID != null && degreeID != undefined) && (courseName != '' && courseName != null && courseName != undefined)) {

        $.ajax({
            url: BASE_URL + INSERT_COURSE + "universityDegreeID=" + degreeID + "&courseID=" + courseID,
            type: 'get',
            contenttype: "application/json; charset=utf-8",
            success: function(data) {
                if (data == '1') {
                    $('#ResponseDiv').html('<center><p class="alert alert-success"><strong>SUCCESS!</strong> Successfully Added.</p></center>');
                    setTimeout(function() {
                        LoadBodyContentOnClick('course.html');
                    }, 2000);
                } else {
                    $('#ResponseDiv').html('<center><p class="alert alert-danger"><strong>ERROR!</strong>Already added.</p></center>');
                }

            },
            error: function() {
                $('#ResponseDiv').html('<center><p class="alert alert-danger"><strong>ERROR!</strong> Server Error.</p></center>');

            }
        });


    } else {
        $('#ResponseDiv').html('<center><p class="alert alert-danger"><strong>ERROR!</strong> Alreday Added.</p></center>');
    }


}

function AddNewCourse() {
    var NewCourse = $('#newCourse').val();

    if ((NewCourse != '' && NewCourse != null && NewCourse != undefined)) {
        //   var disciplineObj = new DisciplineData(disciplineName);
        if (SearchIfCourseExits(NewCourse)) {

            $.ajax({
                url: BASE_URL + INSERT_NEW_COURSE + 'newCourse=' + NewCourse,
                type: 'get',
                //data: disciplineObj,
                contenttype: "application/json; charset=utf-8",
                dataType: 'json',
                crossDomain: true,
                async: true,
                success: function(data) {
                    $('#ResponseDiv').html('<center><p class="alert alert-success"><strong>SUCCESS!</strong> Successfully Added.</p></center>');
                    setTimeout(function() {
                        LoadBodyContentOnClick('newCourse.html');
                    }, 2000);

                },
                error: function() {
                    $('#ResponseDiv').html('<center><p class="alert alert-danger"><strong>ERROR!</strong> Server Error.</p></center>');

                }
            });
        } else {
            $('#ResponseDiv').html('<center><p class="alert alert-danger"><strong>ERROR!</strong> Course with this Name already Exists.</p></center>');

        }
    } else {
        $('#ResponseDiv').html('<center><p class="alert alert-danger"><strong>ERROR!</strong> Server Error.</p></center>');
    }

}

function AddNewTag() {

}

function AddBadge() {

}

function AddNewDegree() {
    var newDegree = $('#newDegree').val();

    if ((newDegree != '' && newDegree != null && newDegree != undefined)) {
        //   var disciplineObj = new DisciplineData(disciplineName);
        if (SearchIfAllDegreeExits(newDegree)) {

            $.ajax({
                url: BASE_URL + INSERT_NEW_DEGREE + 'Degree=' + newDegree,
                type: 'get',
                //data: disciplineObj,
                contenttype: "application/json; charset=utf-8",
                dataType: 'json',
                crossDomain: true,
                async: true,
                success: function(data) {
                    $('#ResponseDiv').html('<center><p class="alert alert-success"><strong>SUCCESS!</strong> Successfully Added.</p></center>');
                    setTimeout(function() {
                        LoadBodyContentOnClick('newDegree.html');
                    }, 2000);

                },
                error: function() {
                    $('#ResponseDiv').html('<center><p class="alert alert-danger"><strong>ERROR!</strong> Server Error.</p></center>');

                }
            });
        } else {
            $('#ResponseDiv').html('<center><p class="alert alert-danger"><strong>ERROR!</strong> Degree with this Name already Exists.</p></center>');

        }
    } else {
        $('#ResponseDiv').html('<center><p class="alert alert-danger"><strong>ERROR!</strong> Server Error.</p></center>');
    }

}

function AddPage() {
    var uniID = $('#uniID').val();
    var pageName = $('#pageName').val();
    var pageDescription = $('#pageDescription').val();
    var pageImageName = $('#pageImageName').val();
    if ((uniID != '' && uniID != null && uniID != undefined) && (pageName != '' && pageName != null && pageName != undefined) && (pageDescription != '' && pageDescription != null && pageDescription != undefined) && (pageImageName != '' && pageImageName != null && pageImageName != undefined)) {
        $.ajax({
            url: BASE_URL + INSERT_PAGE + 'pageName=' + pageName + '&pageDescription=' + pageDescription + '&uniID=' + uniID + '&pageImageName=' + pageImageName,
            type: 'get',
            //data: disciplineObj,
            contenttype: "application/json; charset=utf-8",
            dataType: 'json',
            crossDomain: true,
            async: true,

            success: function(data) {
                $('#ResponseDiv').html('<center><p class="alert alert-success"><strong>SUCCESS!</strong> Successfully Added.</p></center>');
                setTimeout(function() {
                    LoadBodyContentOnClick('createePage.html');
                }, 2000);

            },
            error: function() {

                $('#ResponseDiv').html('<center><p class="alert alert-danger"><strong>ERROR!</strong> Server Error.</p></center>');

            }
        });


    } else //outer if
    {

    }
}

function SearchIfUniversityExist(universityName) {
    var result = true;
    $.each(globalUniversitiesArray, function(i) {
        if (globalUniversitiesArray[i].UniversityName.replace(/ /g, '').toLowerCase().toString() == universityName.replace(/ /g, '').toLowerCase().toString()) {
            result = false;
            return false;
        } else {
            result = true;
        }
    });

    return result;
}

function SearchIfDegreeExits(degreeName) {
    var result = true;
    $.each(globalDegreeArray, function(i) {
        if (globalDegreeArray[i].degreeName.replace(/ /g, '').toLowerCase().toString() == degreeName.replace(/ /g, '').toLowerCase().toString()) {
            result = false;
            return result;
        }
    });

    return result;

}

function SearchIfAllDegreeExits(degreeName) {
    var result = true;
    $.each(globalAllDegreeArray, function(i) {
        if (globalAllDegreeArray[i].degreeName.replace(/ /g, '').toLowerCase().toString() == degreeName.replace(/ /g, '').toLowerCase().toString()) {
            result = false;
            return result;
        }
    });

    return result;

}

function SearchIfDisciplineExits(disciplineName) {
    var result = true;
    $.each(globalDisciplineArray, function(i) {
        if (globalDisciplineArray[i].desciplineName.replace(/ /g, '').toLowerCase().toString() == disciplineName.replace(/ /g, '').toLowerCase().toString()) {
            result = false;
            return false;
        } else {
            result = true;
        }
    });

    return result;


}

function SearchIfCourseExits(courseName) {
    var result = true;
    $.each(globalCourseArray, function(i) {
        if (globalCourseArray[i].courseName.replace(/ /g, '').toLowerCase().toString() == courseName.replace(/ /g, '').toLowerCase().toString()) {
            result = false;
            return result;
        } else {
            result = true;
        }
    });

    return result;


}

function GetAllUniversities(setUniToDropDownCheck) {
    $.ajax({
        url: BASE_URL + GET_ALL_UNIVERSITIES,
        type: 'get',
        // data: ,
        contenttype: "application/json; charset=utf-8",
        dataType: 'json',
        crossDomain: true,
        async: true,
        success: function(data) {
            globalUniversitiesArray = data;
            SetUniversitiesDropdown(setUniToDropDownCheck);
        },
        error: function(data) {
            console.log(data);
        }
    });


}

function GetUniversitiesWithoutPages(setUniToDropDownCheck) {
    $.ajax({
        url: BASE_URL + GET_UNIVERSITIES_WITHOUT_PAGES,
        type: 'get',
        // data: ,
        contenttype: "application/json; charset=utf-8",
        dataType: 'json',
        crossDomain: true,
        async: true,
        success: function(data) {
            globalUniversitiesWithoutPagesArray = data;
            // alert(data);
            SetUniversitiesWithoutPagesDropdown(setUniToDropDownCheck);
        },
        error: function(data) {
            console.log(data);
        }
    });


}

function getAllUser() {
    $.ajax({
        url: BASE_URL + GET_ALL_UNIVERSITIES,
        type: 'get',
        // data: ,
        contenttype: "application/json; charset=utf-8",
        dataType: 'json',
        crossDomain: true,
        async: true,
        success: function(data) {
            globalUniversitiesArray = data;
            SetUniversitiesDropdown(setUniToDropDownCheck);
        },
        error: function(data) {
            console.log(data);
        }
    });

}

function getDegrees(setDegreeToDropDownCheck) {

    var uniId = $('#uniID').val();
    $.ajax({
        url: BASE_URL + GET_ALL_DEGREES_BY_UNIIVERSITY_ID + 'id=' + uniId,
        type: 'get',
        // data: ,
        contenttype: "application/json; charset=utf-8",
        success: function(data) {
            console.log(data);
            globalDegreeArray = data;
            SetDegreesDropdown(true);

        },
        error: function(data) {
            console.log(data);
        }
    });

}



function GetAllDisciplines(setDisciplinetoDropDownCheck) {
    $.ajax({
        url: BASE_URL + GET_ALL_DISCIPLINES,
        type: 'get',
        // data: ,
        contenttype: "application/json; charset=utf-8",
        success: function(data) {
            console.log(data);
            globalDisciplineArray = data;
            SetDisciplineDropdown(setDisciplinetoDropDownCheck);



        },
        error: function(data) {
            console.log(data);
        }
    });

}

function GetAllDegrees(setAllDegreetoDropDownCheck) {
    $.ajax({
        url: BASE_URL + GET_ALL_DEGREES,
        type: 'get',
        // data: ,
        contenttype: "application/json; charset=utf-8",
        success: function(data) {
            console.log(data);
            globalAllDegreeArray = data;
            SetAllDegreesDropdown(setAllDegreetoDropDownCheck);



        },
        error: function(data) {
            console.log(data);
        }
    });

}

function GetAllCourses(setDisciplinetoDropDownCheck) {
    $.ajax({
        url: BASE_URL + GET_ALL_COURSES,
        type: 'get',
        // data: ,
        contenttype: "application/json; charset=utf-8",
        success: function(data) {
            console.log(data);
            globalCourseArray = data;
            SetCoursesDropdown(setDisciplinetoDropDownCheck)
                // SetDisciplineDropdown(setDisciplinetoDropDownCheck);



        },
        error: function(data) {
            console.log(data);
        }
    });

}

function SetDegreesDropdown(setDegreeToDropDownCheck) {
    if (setDegreeToDropDownCheck) {
        $('#degreeID').html('<option value="-1">Select Degree</option>');

        $.each(globalDegreeArray, function(i) {
            $('#degreeID').append('<option value="' + globalDegreeArray[i].UniversityDegreeID + '">' + globalDegreeArray[i].DegreeName + '</option>');
        });
    }


}

function SetAllDegreesDropdown(setDegreeToDropDownCheck) {
    if (setDegreeToDropDownCheck) {
        $('#degreeID').html('<option value="-1">Select Degree</option>');

        $.each(globalAllDegreeArray, function(i) {
            $('#degreeID').append('<option value="' + globalAllDegreeArray[i].degreeID + '">' + globalAllDegreeArray[i].degreeName + '</option>');
        });
    }


}

function SetUniversitiesDropdown(setUniToDropDownCheck) {
    if (setUniToDropDownCheck) {
        $('#uniID').html('<option value="-1">Select University</option>');
        $.each(globalUniversitiesArray, function(i) {
            $('#uniID').append('<option value="' + globalUniversitiesArray[i].universityID + '">' + globalUniversitiesArray[i].universityName + '</option>');
        });
    }
}

function SetUniversitiesWithoutPagesDropdown(setUniToDropDownCheck) {
    if (setUniToDropDownCheck) {
        $('#uniID').html('<option value="-1">Select University</option>');
        $.each(globalUniversitiesWithoutPagesArray, function(i) {
            $('#uniID').append('<option value="' + globalUniversitiesWithoutPagesArray[i].universityID + '">' + globalUniversitiesWithoutPagesArray[i].universityName + '</option>');
        });
    }
}

function SetDisciplineDropdown(setDisciplinetoDropDownCheck) {
    if (setDisciplinetoDropDownCheck) {
        $('#disciplineID').html('<option value="-1">Select discipline</option>');
        $.each(globalDisciplineArray, function(i) {
            $('#disciplineID').append('<option value="' + globalDisciplineArray[i].desciplineID + '">' + globalDisciplineArray[i].desciplineName + '</option>');
        });
    }
}

function SetCoursesDropdown(setDisciplinetoDropDownCheck) {
    if (setDisciplinetoDropDownCheck) {
        $('#courseName').html('<option value="-1">Select Courses</option>');
        $.each(globalCourseArray, function(i) {
            $('#courseName').append('<option value="' + globalCourseArray[i].courseID + '">' + globalCourseArray[i].courseName + '</option>');
        });
    }
}




// =========================================== Custom Functions Ends =========================================
//*************************************************************************************************************
// =========================================== AutoRefresh Function Starts ====================================

function StoredLoggedInUserInfo(loggedInUserInfo) {
    localStorage.setItem(LOGGED_IN_USER_INFO, JSON.stringify(loggedInUserInfo));
}

function GetLoggedInUserInfo() {
    return JSON.parse(localStorage.getItem(LOGGED_IN_USER_INFO));
}

function Logout() {
    var loggedInUserInfo = null;
    localStorage.setItem(LOGGED_IN_USER_INFO, JSON.stringify(loggedInUserInfo));
    window.location.assign("index.html");
}

function UpdateActiveClass() {

    $(".x-navigation li").click(function() {
        $(this).removeClass("active");
        $(this).closest("li").addClass("active");
    });
}

function SetCurrentPageLoadedStoreInSession(pageName) {
    sessionStorage.setItem("CurrentPageLoaded", pageName);
}

function GetCurrentPageLoadedStoreInSession() {
    return sessionStorage.getItem("CurrentPageLoaded");
}

function LoadCurrentPageLoadedStoreInSession() {
    LoadBodyContentOnClick(sessionStorage.getItem("CurrentPageLoaded"));
}

function CheckSession() {
    /*    var LoggedInUser = GetLoggedInUserInfo();

        var currentPageLoaded = window.location.href.split(URL_SPLIT)[1];
        if(currentPageLoaded == "index.html" || (currentPageLoaded == "" || currentPageLoaded == null) || currentPageLoaded == "login.html"){
            if(LoggedInUser != null && LoggedInUser != ""){
                LoginValidation(LoggedInUser.userEmail.toLowerCase(), LoggedInUser.userPassword,LoggedInUser.userTypeId);
               // window.location.assign("admin-portal.html");
                //LoadBodyContentOnClick(GetCurrentPageLoadedStoreInSession());
            }
        }else if(currentPageLoaded == "admin-portal.html"){
            if(LoggedInUser == null || LoggedInUser == "") {
                window.location.assign("index.html");
            }else{
                LoadBodyContentOnClick(GetCurrentPageLoadedStoreInSession());
            }
        }*/
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function ValidateInputFieldForIntegers(evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}

function getUniversitiesLists() {
    var html = '';
    $.get("http://uninamaapi.azurewebsites.net/api/university/GetAllUniversitieslist", function(data, status) {
        data.forEach(function(element) {
            html = '<tr>' +
                '<td>' + element.$id + '</td>' +
                '<td>' + element.universityID + '</td>' +
                '<td>' + element.universityName + '</td>' +
                '<td><img src="http://uninamaapi.azurewebsites.net/images/Uniimages/' + element.universityLogo + '" width="50" height="50" /></td>' +
                '<td><img src="http://uninamaapi.azurewebsites.net/images/Uniimages/' + element.universityLogo + '" width="100" height="50" /></td>' +
                '<td>' +
                '<button class="btn btn-warning" id="' + element.universityID + '" onclick="selectData(' + element.universityID + ')" data-toggle="modal" data-target="#editModal">Update</button>' +
                '<button class="btn btn-primary" id="' + element.universityID + '" onclick="selectData(' + element.universityID + ')" data-toggle="modal" data-target="#logoModal">Logo</button>' +
                '<button class="btn btn-success" id="' + element.universityID + '" onclick="selectData(' + element.universityID + ')" data-toggle="modal" data-target="#coverModal">Cover</button>' +
                '<button class="btn btn-danger" id="' + element.universityID + '" onclick="selectData(' + element.universityID + ')" data-toggle="modal" data-target="#delModal">Delete</button>' +
                '</td>' +
                '</tr>';
            $('#tableRow').append(html);
        }, this);
    });
}

function getDegreesLists() {
    $.get("http://uninamaapi.azurewebsites.net/api/Data/GetAllDegrees", function(data, status) {
        data.forEach(function(element) {
            html = '<tr>' +
                '<td>' + element.$id + '</td>' +
                '<td>' + element.degreeID + '</td>' +
                '<td>' + element.degreeName + '</td>' +
                '<td>' +
                '<button class="btn btn-warning" id="' + element.degreeID + '" onclick="selectData(' + element.degreeID + ')" data-toggle="modal" data-target="#editModal">Update</button>' +
                '<button class="btn btn-danger" id="' + element.degreeID + '" onclick="selectData(' + element.degreeID + ')" data-toggle="modal" data-target="#delModal">Delete</button>' +
                '</td>' +
                '</tr>';
            $('#tableRow').append(html);
        }, this);
    });
}

function getCourseLists() {
    $.get("http://uninamaapi.azurewebsites.net/api/Data/GetAllCourses", function(data, status) {
        data.forEach(function(element) {
            html = '<tr>' +
                '<td>' + element.$id + '</td>' +
                '<td>' + element.courseID + '</td>' +
                '<td>' + element.courseName + '</td>' +
                '<td>' +
                '<button class="btn btn-warning" id="' + element.courseID + '" onclick="selectData(' + element.courseID + ')" data-toggle="modal" data-target="#editModal">Update</button>' +
                '<button class="btn btn-danger" id="' + element.courseID + '" onclick="selectData(' + element.courseID + ')" data-toggle="modal" data-target="#delModal">Delete</button>' +
                '</td>' +
                '</tr>';
            $('#tableRow').append(html);
        }, this);
    });
}

function getDesplinesLists() {
    $.get("http://uninamaapi.azurewebsites.net/api/Data/GetAllDiscipline", function(data, status) {
        data.forEach(function(element) {
            html = '<tr>' +
                '<td>' + element.$id + '</td>' +
                '<td>' + element.desciplineID + '</td>' +
                '<td>' + element.desciplineName + '</td>' +
                '<td>' +
                '<button class="btn btn-warning" id="' + element.desciplineID + '" onclick="selectData(' + element.desciplineID + ')" data-toggle="modal" data-target="#editModal">Update</button>' +
                '<button class="btn btn-danger" id="' + element.desciplineID + '" onclick="selectData(' + element.desciplineID + ')" data-toggle="modal" data-target="#delModal">Delete</button>' +
                '</td>' +
                '</tr>';
            $('#tableRow').append(html);
        }, this);
    });
}

function getBadgesList() {
    $.get("http://uninamaapi.azurewebsites.net/api/NewsFeed/GetAllbadges", function(data, status) {
        data.forEach(function(element) {
            html = '<tr>' +
                '<td>' + element.$id + '</td>' +
                '<td>' + element.badgeID + '</td>' +
                '<td>' + element.badgeName + '</td>' +
                '<td><img src=" ' + element.badgeImage + '" width="50" height="50" /></td>' +
                '<td>' +
                '<button class="btn btn-warning" id="' + element.badgeID + '" onclick="selectData(' + element.badgeID + ')" data-toggle="modal" data-target="#editModal">Update</button>' +
                '<button class="btn btn-success" id="' + element.badgeID + '" onclick="selectData(' + element.badgeID + ')" data-toggle="modal" data-target="#badgeModal">Image</button>' +
                '<button class="btn btn-danger" id="' + element.badgeID + '" onclick="selectData(' + element.badgeID + ')" data-toggle="modal" data-target="#delModal">Delete</button>' +
                '</td>' +
                '</tr>';
            $('#tableRow').append(html);
        }, this);
    });
}

function getTagsList() {
    $.get("http://uninamaapi.azurewebsites.net/api/NewsFeed/GetAllTags", function(data, status) {
        data.forEach(function(element) {
            html = '<tr>' +
                '<td>' + element.$id + '</td>' +
                '<td>' + element.tagID + '</td>' +
                '<td>' + element.tagName + '</td>' +
                '<td>' +
                '<button class="btn btn-warning" id="' + element.tagID + '" onclick="selectData(' + element.tagID + ')" data-toggle="modal" data-target="#editModal">Update</button>' +
                '<button class="btn btn-danger" id="' + element.tagID + '" onclick="selectData(' + element.tagID + ')" data-toggle="modal" data-target="#delModal">Delete</button>' +
                '</td>' +
                '</tr>';
            $('#tableRow').append(html);
        }, this);
    });
}

function getTotalUniversities() {
    $.get("http://uninamaapi.azurewebsites.net/api/university/GetAllUniversitieslist", function(data, status) {
        var html;
        if (data.length > 0) {
            html = '<div class="widget-int num-count">' + data.length + '</div>'
        } else {
            html = '<div class="widget-int num-count">0</div>'
        }
        $('#totalUni').append(html);
    });
}

function getTotalTags() {
    $.get("http://uninamaapi.azurewebsites.net/api/NewsFeed/GetAllTags", function(data, status) {
        var html;
        if (data.length > 0) {
            html = '<div class="widget-int num-count">' + data.length + '</div>'
        } else {
            html = '<div class="widget-int num-count">0</div>'
        }
        $('#totalTags').append(html);
    });
}

function getTotalBadges() {
    $.get("http://uninamaapi.azurewebsites.net/api/NewsFeed/GetAllbadges", function(data, status) {
        var html;
        if (data.length > 0) {
            html = '<div class="widget-int num-count">' + data.length + '</div>'
        } else {
            html = '<div class="widget-int num-count">0</div>'
        }
        $('#totalBadges').append(html);
    });
}

function getTotalDegrees() {
    $.get("http://uninamaapi.azurewebsites.net/api/Data/GetAllDegrees", function(data, status) {
        var html;
        if (data.length > 0) {
            html = '<div class="widget-int num-count">' + data.length + '</div>'
        } else {
            html = '<div class="widget-int num-count">0</div>'
        }
        $('#totalDegrees').append(html);
    });
}

function getTotalCourses() {
    $.get("http://uninamaapi.azurewebsites.net/api/Data/GetAllCourses", function(data, status) {
        var html;
        if (data.length > 0) {
            html = '<div class="widget-int num-count">' + data.length + '</div>'
        } else {
            html = '<div class="widget-int num-count">0</div>'
        }
        $('#totalCourses').append(html);
    });
}

function getTotalDisciplines() {
    $.get("http://uninamaapi.azurewebsites.net/api/Data/GetAllDiscipline", function(data, status) {
        var html;
        if (data.length > 0) {
            html = '<div class="widget-int num-count">' + data.length + '</div>'
        } else {
            html = '<div class="widget-int num-count">0</div>'
        }
        $('#totalDisciplines').append(html);
    });
}

var dataId = "";

function selectData(id) {
    dataId = id;
    console.log(dataId);
}

function deleteUni() {
    console.log(dataId);
    dataId = "";
}

function deleteDegree() {
    console.log(dataId);
    dataId = "";
}

function deleteBadge() {
    console.log(dataId);
    dataId = "";
}

function deleteTag() {
    console.log(dataId);
    dataId = "";
}

function deleteCourse() {
    console.log(dataId);
    dataId = "";
}

function deleteDescpline() {
    console.log(dataId);
    dataId = "";
}

function ReloadJavascripts() {

    $('<script />', { type: 'text/javascript', src: 'js/plugins/jquery/jquery.min.js' }).load('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins/jquery/jquery-ui.min.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins/bootstrap/bootstrap.min.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins/icheck/icheck.min.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins/mcustomscrollbar/jquery.mCustomScrollbar.min.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins/scrolltotop/scrolltopcontrol.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins/morris/raphael-min.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins/morris/morris.min.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins/rickshaw/d3.v3.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins/rickshaw/rickshaw.min.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins/jvectormap/jquery-jvectormap-1.2.2.min.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins/jvectormap/jquery-jvectormap-world-mill-en.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins/bootstrap/bootstrap-datepicker.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins/owl/owl.carousel.min.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins/session/jquery.session.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins/blueimp/jquery.blueimp-gallery.min.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins/dropzone/dropzone.min.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins/moment.min.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins/daterangepicker/daterangepicker.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/settings.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/actions.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/demo_dashboard.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins/tagsinput/jquery.tagsinput.min.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins/bootstrap/bootstrap-file-input.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins/bootstrap/bootstrap-select.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins/dropzone/dropzone.min.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins/fileinput/fileinput.min.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins/filetree/jqueryFileTree.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins/FileUpload/jquery.ui.widget.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins/FileUpload/jquery.iframe-transport.js' }).append('#JavascriptTags');
    $('<script />', { type: 'text/javascript', src: 'js/plugins/FileUpload/jquery.fileupload.js' }).append('#JavascriptTags');

}

// =========================================== AutoRefresh Function Ends ========================================