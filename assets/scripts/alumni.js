//CODE FOR FORM SUBMISSION
function submitAlumniForm(e){
		(async () => {
			let inputs = Array.from(this.getElementsByTagName('input'));
			let thisForm = new FormData();
			for(let ele of inputs){
				if(ele.type === 'file' && (ele.files[0] ?? false)){
					let file = ele.files[0];
					//file size limit @ 10 mb
					if(file.size <= 10485760 && (file.type == 'image/jpeg' || file.type === 'image/png')){
						let buffer = await file.arrayBuffer();
						let blob = new Blob([buffer]);
						thisForm.append('image',blob);
					} else{
						if(file.size > 10485760) alert('File Size exceeds 10MB');
						else alert('Incorrect File Format please select a jpeg or a png');
						return;
					  }
				} else {
					thisForm.append(ele.name, ele.value);
				}
			}
			let submitButton = document.getElementById('submitButton');
			let preloader = document.getElementById('preloader');
			console.log(preloader, submitButton)
			submitButton.style.transform = 'scale(0)';
			preloader.style.transform = 'scale(1)';
			fetch('/alumni/add-alumni', {
				method : "POST",
				body : thisForm
			  }).then(res => res.json()).then(res => {
				  preloader.style.transform = 'scale(0)'
				  submitButton.style.transform = 'scale(1)';
				if(res.err){
				  alert(res.err);
				} else {
					alert('Your application has been submitted');
					hideModalHelper();
				}
			  });
		})();
}
//END


function getAlumniList(batch) {
	$.ajax({
		url: `http://localhost:8000/alumni/batch/${batch}`,
		type: 'GET',
		success: function (alumnis) {
			document.getElementById('all-alumnis').innerHTML = '';
			const container = document.getElementById('all-alumnis');
			let wholeContent = '';
			wholeContent += '<div class="row">';
			for (let alumni of alumnis) {
				let content = '';
				let { imageURL } = alumni;
				if (imageURL !== null && imageURL.length === 0) imageURL = null;

				content += `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3">
      <div class="our-team">
        <div class="picture">
          <img class="img-fluid" src=${imageURL === null ? '/images/user_default.png' : imageURL}>
        </div>
        <div class="team-content">
          <h3 class="name">${alumni.name}</h3>
          <h5 class="title">${alumni.batch}</h5>
        </div>
        <ul class="social">
          <li><a href="mailto:${alumni.email}" class="fa fa-google-plus" aria-hidden="true" target="_blank"></a></li>
          <li><a href="${alumni.linkedin}" class="fa fa-linkedin" aria-hidden="true" target="_blank"></a></li>
        </ul>
      </div>
    </div>

        `;
				wholeContent += content;
			}
			wholeContent += '</div>';
			container.innerHTML = wholeContent;
		},
		error: function (err) {
			console.error('error ', err);
		},
	});
}

var menu = document.getElementById('batch');
menu.onchange = function (e) {
	e.preventDefault();
	getAlumniList(menu.value);
};

window.onload = function () {
	var currentBatch = sessionStorage.getItem('batch');
	// console.log('batch is ', currentBatch);
	if (currentBatch == null) {
		currentBatch = 'all';
	}
	$('#batch').val(currentBatch);
	getAlumniList(currentBatch);
};

$('#batch').change(function () {
	var selVal = $(this).val();
	sessionStorage.setItem('batch', selVal);
});

const hideModalHelper = () => {
	let cbutton = $('.cancel-button')[0];
	hideModal.call(cbutton,'');
}

const hideModal = function (event) {
	const form = $('.alumni-submit')[0];
	form.style.transitionDuration = '0ms';
	form.style.transform = 'scale(0)';
	let heading = $('.alumni-submit')[0].children[0].children[0];
	heading.innerHTML = 'Register as an Alumnus';
	this.style.display = 'none';
};

const showModal = event => {
	const cbutton = $('.cancel-button')[0];
	cbutton.style.display = 'block';
	const form = $('.alumni-submit')[0];
	form.style.transitionDuration = '200ms';
	form.style.transform = 'scale(1)';
	if (window.innerWidth <= 450) {
		let heading = $('.alumni-submit')[0].children[0].children[0];
		heading.innerHTML = 'Register';
	}
};
