let countyurl="https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
let edurl="https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"

let countydata
let edudata
let canvas=d3.select("#canvas")
const tooltip=d3.select("#tooltip")
let legend=d3.select("#legend")

let draw=()=>{
    const colors=["#E5F5E0","#E5F5E0","#A1D99B","#74C476","#41AB5D","#238B45","#006D2C"]
    const education=edudata.map(item=>item.bachelorsOrHigher)
    const min=d3.min(education)
    const max=d3.max(education)
 
    const colorscale=d3.scaleLinear()
                    .domain([min,max])
                    .range([0,180])
                    .nice();
                    
    
    legend.selectAll("rect")
                    .data(colors)
                    .enter()
                    .append("rect")
                    .attr("x",(d,i)=>700+i*22.5)
                    .attr('y',8)
                    .attr("width",22.5)
                    .attr('height',20)
                    .attr("fill",(d,i)=>colors[i])               
    canvas.selectAll("path")
           .data(countydata)
           .enter()
           .append("path")
           .attr("d",d3.geoPath())
           .attr("class","county")
           .attr("fill",(citem)=>{
            let id=citem.id;
            let data=edudata.find(item=>{
                return item.fips===id
            })
           return colors[Math.ceil(colorscale(data.bachelorsOrHigher)/30)]
           })
           .attr("data-fips",(fip)=>{
            let id=fip.id;
            let data=edudata.find(item=>{
                return item.fips===id
            })
            return data.fips
           })
           .attr("data-education",(edu)=>{
            let id=edu.id;
            let data=edudata.find(item=>{
                return item.fips===id
            })
            return data.bachelorsOrHigher
           })
           .on("mouseover",(event,citem)=>{
            //console.log(citem)
            const x = event.clientX;
            const y = event.clientY;
            //console.log(x,y)
            let id=citem.id;
            let data=edudata.find(item=>{
                return item.fips===id
            })
    
                tooltip.style("visibility","visible")
                        .text("helooooo")
                        .style("top",y+"px")
                        .style("left",x+"px")
                        .attr("data-education",data.bachelorsOrHigher)
                        .text(`${data.area_name}  ${data.state}  ${data.bachelorsOrHigher}%`)
           })               
           .on("mouseout",(event,d)=>{
            tooltip.style("visibility","hidden")
           })
           const axis=d3.axisBottom(colorscale)
    axis.tickFormat((d)=>d+"%")
    .tickValues(d3.range(0, 80, 10))
    canvas.select(".color-axis").call(axis)
    .attr("transform","translate(700,30)")
    
}

d3.json(countyurl).then(
    (data,error)=>{
        if(error)
        console.log(error)
        else
        {
            countydata=topojson.feature(data,data.objects.counties).features
           
            d3.json(edurl).then(
                (data,error)=>{
                    if(error)
                    console.log(error)
                    else
                    {
                        edudata=data
                       
                        draw()
                    }
                }
            )
        }
    }
)
