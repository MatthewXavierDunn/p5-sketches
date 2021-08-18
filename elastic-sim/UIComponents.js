class Slider {
  static sliders = new Map();

  constructor(parent, name="Slider", min=0, max=100, value=0, step=1) {
    this.div = createDiv();
    this.div.parent(parent);
    
    this.name = createP(name + ": ");
    this.name.parent(this.div);
    this.name.style("display", "inline");
    this.name.style("font-size", "12px");
    this.name.style("padding", "0");
    this.name.style("margin", "0");
    
    this.value = createP(value);
    this.value.parent(this.div);
    this.value.style("display", "inline");
    this.value.style("font-size", "12px");
    this.value.style("padding", "0");
    this.value.style("margin", "0");
    
    this.slider = createSlider(min, max, value, step);
    this.slider.parent(parent);
    this.slider.style("display", "block");
    
    Slider.sliders.set(name, this);
  }
}

class Field {
  constructor(name="Field") {
    this.div = createDiv();
    this.div.style("font-family", "Fira Code");
    this.div.style("color", "#ddd");
    this.div.style("text-align", "center");
    this.div.style("font-size", "14px");
    this.div.style("border", "1px solid #444");
    this.div.style("border-radius", "4px");
    this.div.style("display", "inline-block");
    this.div.style("margin", ".4em");
    this.div.style("padding", ".8em");
    this.div.style("background", "#222");

    this.name = createP(name);
    this.name.parent(this.div);
    this.name.style("color", "white");
  }
}

class Button {
  constructor(parent, name="Button") {
    this.button = createButton(name);
    this.button.style("background", "#222");
    this.button.style("color", "white");
    this.button.style("border", "1px solid #444");
    this.button.style("border-radius", "4px");
    this.button.style("width", "100%");
    this.button.style("padding", "0.4em 0");
    this.button.parent(parent);
  }
}

function updateUI() {
  for (let [name, slider] of Slider.sliders) {
    slider.value.html(slider.slider.value())
  }
}