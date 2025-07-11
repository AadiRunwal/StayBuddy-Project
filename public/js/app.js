//_______________ JavaScript to Prevent Forms Submissions with Invalid Fields. _______________

(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

let profile = document.querySelector(".profile");
let popup = document.querySelector(".popup");
profile.addEventListener("click",()=>{
  popup.classList.toggle("show")
})