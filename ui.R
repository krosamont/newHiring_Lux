shinyUI(
        fluidPage(  
                titlePanel(HTML(paste("New hirings of foreign workers per nationality in Luxembourg, 1982-2009", sep="<br/>"))),
                h5("Integration of d3.js in Shiny"),
 
                #Here we add the .css and .js files that we need for this webpage
                tags$head(tags$link(rel = "stylesheet", type = "text/css", href = "bubble_chart.css")),
                tags$head(tags$script(src="d3.min.js")),
                tags$head(tags$script(src="tooltip_ForceBubble.js")),
                tags$head(tags$script(src="forceBubble.js")),
                tags$div( class = "container",
                          tags$div(id="toolbar",
                                   tags$span(id="lab_split","Split Bubbles:"),
                                   tags$br(),
                                   tags$label( class="switch",
                                               tags$input(type="checkbox"),
                                               tags$div( id="all", class="slider")
                                   )
                          ),
                          tags$div(id="vizBubble")
                ),
                h6( a("Data sources", href="https://web.archive.org/web/20170113194953/http://www.statistiques.public.lu/stat/TableViewer/tableViewHTML.aspx?ReportId=12929&IF_Language=eng&MainTheme=2&FldrName=3&RFPath=92", target='_blank'))
        )
) 
