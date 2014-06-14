'use strict';
angular.module("dashboard",[]);
angular.module("manageUsers",[]);
var educationMediaApp=angular.module('educationMediaApp', ['ngResource','ngRoute','ng-bootstrap-datepicker','ngTouch']);

$(document).ready(function(){
    $('#side-menu').metisMenu();
    if ($(this).width() < 768) {
        $('div.sidebar-collapse').addClass('collapse')
    } else {
        $('div.sidebar-collapse').removeClass('collapse')
    }
    $(document).on('click', '.dropdown-menu[role="menu"] li', function (event) {
        event.preventDefault();
        if ($(this).hasClass('dropdown-submenu')) {
            return;
        } else {
            if ($(this).parents('li').hasClass('dropdown-submenu')) {
                $(this).parents('.btn-group').find('.dropdownValuePlaceHolder')
                    .text($(this).parents('li.dropdown-submenu').children('a').text())
                    .data('url',
                        $(this).parents('li.dropdown-submenu').children('a').data('url') + ' , ' + $(this).find('a').data('url'));
                return;
            }
        }
        $(this).parents('.btn-group').find('.dropdownValuePlaceHolder')
            .html($(this).find('a').html())
            .data('url', $(this).find('a').data('url'));

    });
    window.ddmmyyyTommddyyyy=function(dateStr,delimiter){
        if(!dateStr)return null;
        var arr=dateStr.split(delimiter);
        console.log("ddmmyyyTommddyyyy",dateStr,delimiter,arr);
        if(arr.length==3){
            var retStr=arr[1]+delimiter+arr[0]+delimiter+arr[2];
            console.log("ddmmyyyTommddyyyy retStr",retStr);
            return retStr;
        }else{
            return null;
        }
    }


});
$(window ).resize(function() {
    if ($(this).width() < 768) {
        $('div.sidebar-collapse').addClass('collapse')
    } else {
        $('div.sidebar-collapse').removeClass('collapse')
    }
});

/*
$(function() {



});

//Loads the correct sidebar on window load
$(function() {

    $(window).bind("load", function() {
        console.log($(this).width())
        if ($(this).width() < 768) {
            $('div.sidebar-collapse').addClass('collapse')
        } else {
            $('div.sidebar-collapse').removeClass('collapse')
        }
    })
})

//Collapses the sidebar on window resize
$(function() {

    $(window).bind("resize", function() {
        console.log($(this).width())
        if ($(this).width() < 768) {
            $('div.sidebar-collapse').addClass('collapse')
        } else {
            $('div.sidebar-collapse').removeClass('collapse')
        }
    })
})*/
