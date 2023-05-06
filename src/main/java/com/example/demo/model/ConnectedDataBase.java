package com.example.demo.model;

import org.sqlite.JDBC;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ConnectedDataBase {
    private Connection connect = null;

    //метод для получения соединения с БД
    public Connection getConnect() {
        if (connect == null) {
            System.out.println("Connection closed");
        }
        return connect;
    }

    //метод для закрытия соединяния с БД
    public void closeConnection() {
        try {
            if (getConnect() != null)
                getConnect().close();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }

    }

    //метод для установки соединения с БД
    public void setConnect(Connection connect) {
        this.connect = connect;
    }

    //создать соединение с БД
    public static Connection connect(String pathDb) throws SQLException {
        Connection  conn= null;
        DriverManager.registerDriver(new JDBC());
        // Выполняем подключение к базе данных
        try {
            // db parameters
            String url = "jdbc:sqlite:" + pathDb;
            // create a connection to the database
            conn = DriverManager.getConnection(url);
            if (conn == null)
                System.err.println("Connection not opened");
            //System.out.println("Database connected");
            //System.out.println("Connection closed? " + conn.isClosed());
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
        return conn;
    }

    //выбрать все данные из таблицы
    public List<Date> selectId(String tableName,int numberElement) {
        List<Date> dates = new ArrayList<>();
        if (getConnect() == null) {
            return null;
        }
        if (tableName == null) {
            System.out.println("Not Object");
            return null;
        }
        try {

            String selectString = "select * from " + tableName + " ORDER BY random() LIMIT " + numberElement;
            PreparedStatement selectStmt = getConnect().prepareStatement(selectString);
            ResultSet result = selectStmt.executeQuery();
            while (result.next()) {
                Date date = new Date();
                try {
                    date.date = result.getString("date");
                    date.event = result.getString("event");
                } catch (SQLException e) {
                    System.out.println("\n Error: " + e.getMessage());
                }
                dates.add(date);
            }
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
        return dates;
    }
}
