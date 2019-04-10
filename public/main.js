
// main.js
var update = document.getElementById('update')

update.addEventListener('click', function () {
  // Send PUT Request here
  fetch('values', {
  method: 'put',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    'name': 'Lorem',
    'values': 'Ipsum'
  })
})
.then(res => {
  if (res.ok) return res.json()
})
.then(data => {
  console.log(data)
   window.location.reload(true)
})

})