$(document).ready(function() {

	$("#save").click(function(e) {
		// Get the trimmed content of the imageContainer
		var containerContent = $.trim($("#imageContainer").html());

		// Check if the container is empty
		if (containerContent === "") {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Please draw your signature!",
				allowOutsideClick: false,
			});

			e.preventDefault();
		}
	});

	$("#form").submit(function() {
		Swal.fire({
			title: "Loading...",
			html: "Please wait",
			allowOutsideClick: false,
			didOpen: () => {
				Swal.showLoading();
			},
		});
	});

	var signaturePad;
	var canvas;

	function initializeSignaturePad() {
		canvas = $("#signature_pad")[0];
		signaturePad = new SignaturePad(canvas, {
			minWidth: 2,
			maxWidth: 4,
		});

		resizeCanvas();
	}

	function resizeCanvas() {
		var ratio = Math.max(window.devicePixelRatio || 1, 1);
		canvas.width = canvas.offsetWidth * ratio;
		canvas.height = canvas.offsetHeight * ratio;
		canvas.getContext("2d").scale(ratio, ratio);
		let storedData = signaturePad.toData();
		signaturePad.clear();
		signaturePad.fromData(storedData);
	}

	$(window).on("resize", resizeCanvas);

	$("#drawSignature").on("shown.bs.modal", function() {
		initializeSignaturePad();
	});

	$(".modal-footer .btn:contains('Clear')").on("click", function() {
		signaturePad.clear();
	});

	$("data-bs-dismiss").click(function() {
		signaturePad.clear();
	})

	$(".modal-footer .btn:contains('Done')").on("click", function() {
		const pngDataUrl = signaturePad.toDataURL("image/png");
		const imageContainer = $("#imageContainer");

		// Check if the signature pad is empty
		if (signaturePad.isEmpty()) {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Please draw your signature!",
				allowOutsideClick: false,
			});
			return; // Stop further execution if the signature pad is empty
		}

		// Remove existing images in the container
		imageContainer.empty();

		if (imageContainer.length === 1) {
			const imgElement = $("<img>").attr("src", pngDataUrl);
			imageContainer.append(imgElement);
			$("#signature").val(pngDataUrl);
		} else {
			console.error("Error: #imageContainer not found or multiple elements with the same id.");
		}

		// Close the modal after finishing
		$("#drawSignature").modal("hide");
		$("#imageContainer").removeAttr("hidden");
	});

	$(".validInputAlpha").on("input", function() {

		var inputValue = $(this).val();
		var validCharactersRegex = /^[A-Za-z .-]*$/;

		if (!validCharactersRegex.test(inputValue)) {
			$(this).val(inputValue.replace(/[^A-Za-z .-]/g, ""));
		}
	});

	$('.form-control').val('');
	$('.form-select').val('');

	$("#contact[type=text]").on("input", function () {
	    $(this).val(
	        $(this).val().replace(/[^0-9,(),-]/g, "")
	    );
	});

	$(".maxTextLength").on("change", function() {

		var inputValue = $(this).val();

		if (inputValue.length < 2) {
			alert("This field must contain at least 2 characters or more.");
			$(this).val('');
			$(this).focus();
		}
	});

	$(".maxNumLength").on("input", function() {
		var input = $(this).val();
		var number = input;

		if (isNaN(number)) {
			$(this).val("");
		} else {
			if (number.toString().length > 9) {
				$(this).val(number.toString().slice(0, 11));
			}
		}
	});
	
	// Get current date and time
	var currentDateTime = new Date();
	var currentDate = currentDateTime.toISOString().split('T')[0]; // yyyy-mm-dd format
	var currentTime = currentDateTime.getHours().toString().padStart(2, '0') + ':' +
		currentDateTime.getMinutes().toString().padStart(2, '0'); // HH:MM format

	// Set current date and time to the input fields
	document.getElementById('dateAttended').value = currentDate;
	document.getElementById('timeAttended').value = currentTime;
	
	$('input[type="text"]').on('change', function() {
        var input = $(this);
        setTimeout(function() {
            var pastedText = input.val();
            var trimmedText = pastedText.trim();
            input.val(trimmedText);
        }, 0);
    });
    
    $('input[type="email"]').on('change', function() {
        var input = $(this);
        setTimeout(function() {
            var pastedText = input.val();
            var trimmedText = pastedText.trim();
            input.val(trimmedText);
        }, 0);
    });
    
    $('textarea').on('change', function() {
        var input = $(this);
        setTimeout(function() {
            var pastedText = input.val();
            var trimmedText = pastedText.trim();
            input.val(trimmedText);
        }, 0);
    });
    
    $("input, textarea").on("input", function() {
        // Get the current value of the input field
        let inputValue = $(this).val();

        // Capitalize the first letter and concatenate with the rest of the string
        let capitalizedValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);

        // Set the modified value back to the input field
        $(this).val(capitalizedValue);
    });
	
	$(".minDate[type=text]").datepicker({
		dateFormat: "yy-mm-dd",
		changeYear: true,
		changeMonth: true,
		yearRange: "-100:+100", // Set the minimum year to 1900
		minDate: 0, // 0 means today
		onClose: function(selectedDate) {
			var $inputField = $(this);
			var currentDate = new Date();
			var enteredDate = $inputField.datepicker("getDate");

			if ($inputField.val() !== "") {
				if (enteredDate < new Date(1900, 0, 1)) {
					alert("Please select a date not earlier than January 1, 1900.");
					$inputField.val(""); // Reset the value
				} else {
					// Check if the entered date matches the desired format
					var enteredDateString = $.datepicker.formatDate("yy-mm-dd", enteredDate);
					if (selectedDate !== enteredDateString) {
						$inputField.val(""); // Reset the value
						alert("Invalid date format. Please use yyyy-mm-dd.");
					}
				}
			}
		}
	});
	
	$("#dateAttended").change(function() {
		var dateInputted = $(this);
		const dateToday = new Date();
        const formattedDate = $.datepicker.formatDate('yy-mm-dd', dateToday);
        
        if(dateInputted.val() < formattedDate) {
			alert('Please select a date not earlier than today.');
		}
	});
});

// Multi step
const multiStepForm = document.querySelector("[data-multi-step]");
const formSteps = [...multiStepForm.querySelectorAll("[data-step]")];
let currentStep = formSteps.findIndex((step) => {
	return step.classList.contains("active");
});

if (currentStep < 0) {
	currentStep = 0;
	showCurrentStep();
}

multiStepForm.addEventListener("click", (e) => {
	let incrementor;
	if (e.target.matches("[data-next]")) {
		const inputs = [...formSteps[currentStep].querySelectorAll("input")];
		const selects = [...formSteps[currentStep].querySelectorAll("select")];
		const allValid = inputs.every((input) => input.reportValidity());
		const allValidSelect = selects.every((select) => select.reportValidity());
		if (allValid && allValidSelect) {
			incrementor = 1;
			currentStep += incrementor;
			showCurrentStep();
			$('html, body').animate({ scrollTop: 0 }, 'smooth');

			const fnameInput = document.getElementById('fname');
			if (fnameInput) {
			  setTimeout(() => {
				  fnameInput.focus();
			  }, 0);
			}
		} else {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				html: "Please fill in all required fields marked with (<b class='text-danger required-icon'>*</b>).",
				allowOutsideClick: false,
			});
		}
	} else if (e.target.matches("[data-previous]")) {
		incrementor = -1;
		currentStep += incrementor;
		showCurrentStep();
		$('html, body').animate({ scrollTop: 0 }, 'smooth');
	}

	if (incrementor == null) return;

});

formSteps.forEach((step) => {
	step.addEventListener("animationend", (e) => {
		formSteps[currentStep].classList.remove("hide");
		e.target.classList.toggle("hide", !e.target.classList.contains("active"));
	});
});

function showCurrentStep() {
	formSteps.forEach((step, index) => {
		step.classList.toggle("active", index === currentStep);
	});
}

// Open camera
const videoTag = document.getElementById('video-tag');
const canvasElement = document.getElementById('image-tag');
const imageTag = document.getElementById('image-tag2');
const webCam = new Webcam(videoTag, "user", canvasElement);

// Show side bar navigation on tablet view
$(window).resize(function () {
    if ($(window).width() < 992) {
        videoTag.width = 280;
        videoTag.height = 260;
    } else {            
        videoTag.width = 640;
        videoTag.height = 360;
    }
});

if ($(window).width() < 992) {
    videoTag.width = 280;
    videoTag.height = 260;
} else {            
    videoTag.width = 640;
    videoTag.height = 360;
}

function start() {
    $(".photo__camera__icon").attr("hidden", true);
    $("#start").attr("hidden", true);
    $("#captureImage").removeAttr("hidden");
    $("#video-tag").removeAttr("hidden");

    // Start the webcam
    webCam.start();
}

function captureImage() {
    let picture = webCam.snap();
    
    // Create a new Image object to load the captured image
    var img = new Image();
    img.onload = function() {
        // Create a canvas element
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        // Set canvas dimensions to desired high resolution (e.g., double the dimensions)
        canvas.width = img.width * 10;
        canvas.height = img.height * 10;

        // Draw the captured image onto the canvas at high resolution
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert the canvas back to a data URL with higher resolution
        var highResPicture = canvas.toDataURL('image/png', 2.0); // Adjust compression quality as needed (1.0 is highest quality)

        // Set the higher resolution image as the source of the image tag
        imageTag.src = highResPicture;

        // Stop the webcam
        webCam.stop();

        // Hide the video element and capture button, show the captured image and other buttons
        $("#video-tag").attr("hidden", true);
        $("#start").attr("hidden", true);
        $("#captureImage").attr("hidden", true);
        $("#image-tag").removeAttr("hidden");
        $(".reset__button").removeAttr("hidden");
        $("#nextButton").removeAttr("hidden");

        // Set the captured image as the value of the profile input field (as Base64 string)
        $("#profile").val(highResPicture);
    };
    
    // Load the captured image into the Image object
    img.src = picture;
}

function resetCamera() {
	$("#video-tag").removeAttr("hidden");
	$("#captureImage").removeAttr("hidden");
	$("#image-tag").attr("hidden", true);
	$(".reset__button").attr("hidden", true);
	$("#nextButton").attr("hidden", true);
	$("#profile").val("");
	canvasElement.src = '';
	imageTag.src = '';
	webCam.start();
}

function previousStep() {
	if($("#profile").val() == "") {
		webCam.stop();
		
	    $("#start").removeAttr("hidden");
	    $(".photo__camera__icon").removeAttr("hidden");
	    $("#video-tag").attr("hidden", true);
		$("#captureImage").attr("hidden", true);
		$("#image-tag").attr("hidden", true);
		$(".reset__button").attr("hidden", true);
		$("#nextButton").attr("hidden", true);
	}
}

function checkDate(str, e) {
	if ((str.value.length == 4 || str.value.length == 7) && e.keyCode != 8) {
		$(str).val(str.value + '-');
	}
	return isNumeric(e);
}

function validateTime(time) {
	var $inputTime = $(time);
	if (time.value != '') {
		if (!(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(time.value))) {
			alert("Invalid Time Format.");
			$("#" + time.id).val('');
			setTimeout(function() {
				$inputTime.focus();
			}, 0);
		}
	}
}

function autoColon(time, id, evt) {

	var charCode = (evt.which) ? evt.which : event.keyCode;

	var count = (time.match(/:/g) || []).length;

	if (count == 1) {

		if (time == ":") {
			document.getElementById(id).value = "";
		}
		if (time[0] == ":" && time[3] != null) {
			document.getElementById(id).value = time[0] + time[1] + time[2];
		}
		if (time[1] == ":" && time[4] != null) {
			document.getElementById(id).value = time[0] + time[1] + time[2] + time[3];
		}

	}
	else {

		if (charCode == 8 && time.length == 2) {
			document.getElementById(id).value = time[0];
		}

		if (time.length == 3 && time[2] != ":") {
			document.getElementById(id).value = time[0] + time[1] + ":" + time[2];
		}

		if (time.length == 4 && time[2] != ":") {
			document.getElementById(id).value = time[0] + time[1] + ":" + time[2] + time[3];
		}

		if (time.length == 2 && charCode != 8) {
			document.getElementById(id).value = time + ":";
		}
	}

}

















