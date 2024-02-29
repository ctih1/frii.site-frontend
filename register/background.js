const triangle = document.getElementById("triangle");
const background_div = document.getElementById("bg-div");

var new_triangle = triangle.cloneNode(true);

for(i=0; i<(window.innerHeight/42); i++) {
    new_triangle = triangle.cloneNode(true);
    new_triangle.style["left"] = "50px;";
    new_triangle.style["top"] = `${i*40}px`;
    new_triangle.style["animation-delay"] = `-${i*(Math.random()*300)}ms`;
    new_triangle.style["display"] = "block";
    background_div.appendChild(new_triangle);
    delete new_triangle;
}