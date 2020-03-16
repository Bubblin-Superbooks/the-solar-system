((d) => {
  var youtube = d.querySelectorAll('.youtube');
  for (var i = 0; i < youtube.length; i++) {
    var source = `https://i.ytimg.com/vi/${youtube[i].dataset.embed}/sddefault.jpg`
    var image = new Image()
    image.src = source
    image.addEventListener('load', function () {
      youtube[i].appendChild(image)
    }(i))
    youtube[i].addEventListener('click tap', function () {
      var iframe = d.createElement('iframe')
      iframe.setAttribute('frameborder', '0')
      iframe.setAttribute('allowfullscreen', 'true')
      iframe.setAttribute('src', `https://www.youtube.com/embed/${this.dataset.embed}?modestbranding=1&showinfo=0&controls=0&vq=hd720&rel=0&showinfo=0&autoplay=0`)
      this.innerHTML = ''
      this.appendChild(iframe)
    })
  }
})(document)
