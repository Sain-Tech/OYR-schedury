function changeMenu(x){
   
        var y=document.getElementsByClassName("active item")[0];

        y.className="item";
        x.className="active item";


        var d= y.id+"Des"; //active item
        var des=x.id+"Des"; //item
        if(d!=des){
            document.getElementById(des).style.display='block';
            document.getElementById(d).style.display='none';
        }
}



$('.ui.selection.dropdown').dropdown();