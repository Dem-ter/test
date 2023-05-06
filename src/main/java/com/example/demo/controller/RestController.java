package com.example.demo.controller;
import java.sql.*;
import com.example.demo.model.ConnectedDataBase;
import com.example.demo.model.Date;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.List;
@org.springframework.web.bind.annotation.RestController
@RequestMapping("/returnListDate")
public class RestController{
    @PostMapping()
    public List<Date> returnListDate(@RequestBody String numberDates) throws SQLException{

        ConnectedDataBase dates = new ConnectedDataBase();
        dates.setConnect(ConnectedDataBase.connect(System.getProperty("user.dir")+"/src/main/resources/dates.db"));
        List<Date> result = dates.selectId("Dates",Integer.parseInt(numberDates));
        dates.closeConnection();
        return result;
    }
}
