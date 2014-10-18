angular.module('streets')
.controller('AddStoryController', function($location, $scope) {
        var geocoder;

        function initialize() {
            geocoder = new google.maps.Geocoder();
        }

        function codeAddress(address, callback) {
          geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              callback(results[0].geometry.location);
            } else {
              alert('Geocode was not successful for the following reason: ' + status);
            }
          });
        }

        initialize();

        var geocode_callback = function(coords) {
                var url = 'url(http://maps.googleapis.com/maps/api/streetview?size=640x640&location='+ coords.lat() + ',' + coords.lng()+'&fov=90&heading=235&pitch=10)';
                $('#img_header').fadeOut(function() {
                    $('#img_header').css('background-image',url);
                    $('#txt_geocode_address').css('color','white');
                    $('#txt_author_name').css('color','white');
                    $("#black-overlay").addClass('black-overlay');
                    $('#img_header').fadeIn();
                    $('#your_story_container').fadeIn();
                    $('#btn-upload-photo').show();
                    $('#btn_inspire').fadeOut();
                });

        }

        var bind_autocomplete_function = function(event, result){
            codeAddress(result.formatted_address,geocode_callback);
            var new_elem = $('#txt_geocode_address').clone()
            new_elem.val(result.address_components[1].long_name.replace('St','') + " " + result.address_components[0].long_name);
            $('#txt_geocode_address').replaceWith(new_elem);
            new_elem.geocomplete().bind("geocode:result", bind_autocomplete_function);

        }

        $("#txt_geocode_address").geocomplete().bind("geocode:result", bind_autocomplete_function);
        $('#stam_button').click(function() {
            var address = $("#txt_geocode_address").val();
            codeAddress(address,geocode_callback);
        });

        //Setting the date field:

        var m_names = new Array("January", "February", "March",
                    "April", "May", "June", "July", "August", "September",
                    "October", "November", "December");

        var date = new Date();
        $('#actual_date_field').html(m_names[date.getMonth()] +" " + date.getDate()+ ", " + date.getFullYear());

        //Setting the text clickable your story button:

        $('#lbl_your_story').click(function() {
            var final_width = $('#lbl_your_story').width();
            $('#your_story_container').animate({width:final_width},1000,'swing',function() {
                $(this).remove();
                $('#text_area_container').show();
                setTimeout(function() {$('#txt_your_story').focus()},1);
            });
        });


        var publish_function = function() {
            var json = {
                location:$('#txt_geocode_address').val(),
                text: $('#txt_your_story').html(),
                imageUrl:$('#img_header').css('background-image').replace('url(','').replace(')',''),
                authorName:$('#txt_your_name').html(),
            };

            console.log(json);

            $.post('/api/story',json)
            .done(function(story) {
                    console.log("DONE POSTING",story._id,$location.path());

                    $location.path('/story/'+story._id);
                    $scope.$apply();
                    /*
                $('#btn_publish').fadeOut(function() {
                    $('#share_buttons_containers').fadeIn();
                });
                $('#btn-upload-photo').fadeOut();*/

            })
            .fail(function() {
                alert("Failure");
            });
        }


        $('#btn_publish').click(function() {

            $(this).css('background-color','#3cb878');
            $(this).html("Are you sure?");
            $(this).click(publish_function);

        });


        //Handling the publish button:


        var CHARS_MAKES_PUBLISH_APPEAR = 20;
        $('#txt_your_story').keyup(function(){
            var cur_len = $(this).html().length;
            var btn_publish = $('#btn_publish');
            console.log(cur_len);
            if ( cur_len >= CHARS_MAKES_PUBLISH_APPEAR && !btn_publish.is(":visible")  ) {
                btn_publish.fadeIn();
            }

        });


        //Upload photo:

        $('#btn-upload-photo').click(function() {
            $('#btn_upload').click();
        });

         $("input:file").change(function (){
            $("#frm_fileupload").submit();
         });

         $('#postframe').load(function() {
            var url = 'url('+$(this).contents().find("body").html() + ')';
            $('#img_header').css('background-image',url);
         });
});