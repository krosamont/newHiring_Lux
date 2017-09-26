if(!require('rvest'))install.packages("rvest")
library(rvest)

if(!require('dplyr'))install.packages("dplyr")
library(dplyr)

if(!require('reshape2'))install.packages("reshape2")
library(reshape2)

#We take data from statec with the package Rvest

hiring = read_html("https://web.archive.org/web/20170113194953/http://www.statistiques.public.lu/stat/TableViewer/tableViewHTML.aspx?ReportId=12929&IF_Language=eng&MainTheme=2&FldrName=3&RFPath=92")%>%
        html_nodes(".b2020-datatable")%>%
        html_table()
hiring = as.data.frame(hiring)

#We transpose data
hiring = as.data.frame(t(hiring), row.names = FALSE, stringsAsFactors = FALSE)
colnames(hiring) = as.character(hiring[1,]) 


#Take out the first line
hiring = hiring[-1,] %>%
        filter(Year>1981) 

#select some columns
hiring = hiring[,c(1,8:18)]
#We keep the lines that we want : nationalities and year

nhiring = melt(hiring, id.vars=c("Year"))%>%
        rename(year=Year, country=variable)

nhiring$country = gsub("Others", "Other EU countries", nhiring$country )
nhiring$country = gsub("Other european countries", "Other european countries (not in EU)", nhiring$country )

nhiring$value = gsub(",","", nhiring$value)
nhiring$value = as.numeric(gsub("-","0", nhiring$value))

nhiring$isNeighbor = ifelse(nhiring$country %in% c("France", "Germany", "Belgium"),1,0)
nhiring$x = runif(nrow(nhiring))*900
nhiring$y = runif(nrow(nhiring))*800 


#to sum stateless people and non european people in just one
nhiringNotEuropean = nhiring %>%
        group_by(year) %>%
        filter(country %in% c("Stateless people", "Non european countries")) %>%
        mutate(value= sum(value)) %>%
        filter(country=="Non european countries")

#we had the new value of non european and remove stateless people
nhiring = rbind.data.frame(nhiring %>%
                                   filter(!country %in% c("Stateless people", "Non european countries")),
                           nhiringNotEuropean)

nhiring$pathPhoto = paste("img/Flag_of_",nhiring$country,".png", sep="")
nhiring$pathPhoto = gsub(" ", "_", nhiring$pathPhoto)
nhiring$radius = sqrt(nhiring$value/pi)*90/max(sqrt(nhiring$value/pi))

function(input, output, session){
        
        tojson <- reactive({
                df = nhiring %>%
                        as.data.frame()
                djson = jsonlite::toJSON(df)
                djson
        })
        
        observe({
                session$sendCustomMessage(type="jsondata", tojson())
        })
}