const tl = new TimelineMax({
      paused: true
    });

    const clickArea = $('#background');

    let click = true;

    clickArea.on("click", function(){
      console.log('click');
      click ? tl.play() : tl.reverse();
      click = !click;
    });

    tl
    .staggerTo("#background", 1, {
      "background-image": "linear-gradient(#D4ADC3, #72B6FF)"
    }, 0.5, 0)
    .staggerTo("#earth-ring-4 stop", 1, {
      cycle:{
        stopColor: ['#CEA3C1', '#5DA6F3']
      }
    }, 0.5, 0)
    .staggerTo("#earth-ring-3 stop", 1, {
      cycle:{
        stopColor: ['#CA9AC1', '#5396E0']
      }
    }, 0.5, 0)
    .staggerTo("#earth-ring-2 stop", 1, {
      cycle:{
        stopColor: ['#C694C3', '#3978C0']
      }
    }, 0.5, 0)
     .staggerTo("#earth-ring-1 stop", 1, {
      cycle:{
        stopColor: ['#A675AE', '#265489']
      }
    }, 0.5, 0)
    .staggerTo("#earth-1 stop", 1, {
      cycle:{
        stopColor: ['#FFF9EB', '#3A96B9']
      }
    }, 0.5, 0)
    .to("#land-light-1", 1, {fill: '#D9FFA9'}, 0)
    .to("#land-light-2", 1, {fill: '#D9FFA9'}, 0)
    .to("#land-light-3", 1, {fill: '#D9FFA9'}, 0)
    .to("#land-dark-1", 1, {fill: '#95CB8B'}, 0)
    .to("#land-dark-2", 1, {fill: '#95CB8B'}, 0)
    .to("#land-dark-3", 1, {fill: '#95CB8B'}, 0)
    .to("#city-right-1", 1, {fill: '#B3C4B3'}, 0)
    .to("#city-right-2", 1, {fill: '#D5DDC2'}, 0)
    .to("#city-left-2", 1, {fill: '#D5DDC2'}, 0)
    .to("#city-left-3", 1, {fill: '#D5DDC2'}, 0)
    .to('#sun', 1, {ease: Power4.easeInOut, y:-322}, 0)
    .to('#moon', 1, {ease: Power4.easeInOut, y:-200}, 0)
    .progress(1).progress(0);


    const blink1 = $('.blink-1');
    const blink2 = $('.blink-2');
    const blink3 = $('.blink-3');

    const tlBlink1 = new TimelineMax({
      repeat: -1,
      yoyo: true
    });

    tlBlink1
    .to(blink1, 1, {opacity: 0}, 1)
    .to('#cloud-1', 2, {ease: Power4.easeInOut, x:30}, 1)
    .to('#cloud-1', 2, {opacity: 0}, 1)
    .to('#cloud-4', 2, {ease: Power4.easeInOut, x:-20}, 1)
    .to('#cloud-4', 2, {opacity: 0}, 1)
    .to('#cloud', 2, {ease: Power4.easeInOut, x:-50}, 1)
    .to('#cloud', 2, {opacity: 0}, 1)
    .play();

    const tlBlink2 = new TimelineMax({
      repeat: -1,
      yoyo: true
    });

    tlBlink2
    .to(blink2, 1, {opacity: 0}, 2)
    .to('#cloud-2', 2, {ease: Power4.easeInOut, x:-20}, 2)
    .to('#cloud-2', 2, {opacity: 0}, 2)
    .to('#cloud-6', 2, {ease: Power4.easeInOut, x:30}, 2)
    .to('#cloud-6', 2, {opacity: 0}, 2)
    .play();

    const tlBlink3 = new TimelineMax({
      repeat: -1,
      yoyo: true
    });

    tlBlink3
    .to(blink3, 1, {opacity: 0}, 3)
    .to('#cloud-3', 2, {ease: Power4.easeInOut, x:-30}, 3)
    .to('#cloud-3', 2, {opacity: 0}, 3)
    .to('#cloud-5', 2, {ease: Power4.easeInOut, x:30}, 3)
    .to('#cloud-5', 2, {opacity: 0}, 3)
    .play();