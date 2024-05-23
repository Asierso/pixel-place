<?php
$action = strval($_POST['action']);
$host = "127.0.0.1";
$db = "pixelplace";
$sql = mysqli_connect($host, "pixeladm", "1234", $db);

switch ($action) {
    case "pushPixel":
        pushPixel($sql);
        break;
    case "getPixels":
        getPixels($sql);
        break;
    case "getPixelByCoords":
        getPixelByCoords($sql);
        break;
}

function pushPixel($sql)
{
    $coordx = strval($_POST['coordx']);
    $coordy = strval($_POST['coordy']);
    $color = strval($_POST['color']);
    $uuid = intval($_POST['uuid']);
    $consult = mysqli_query($sql, "SELECT * FROM pixelplace WHERE coordx='" . $coordx . "' AND coordy='" . $coordy . "'");
    $exists = false;
    while ($res = mysqli_fetch_array($consult)) {
        $exists = true;
    }

    if ($exists)
        mysqli_query($sql, "UPDATE pixelplace SET color='" . $color . "',uuid=" . $uuid . " WHERE coordx='" . $coordx . "' AND coordy='" . $coordy . "'");
    else
        mysqli_query($sql, "INSERT INTO pixelplace (coordx,coordy,color,uuid) VALUES('" . $coordx . "','" . $coordy . "','" . $color . "'," . $uuid . ")");
    echo json_encode("OK-" . $uuid);
}

function getPixels($sql)
{
    $uuid = strval($_POST['uuid']);
    if ($uuid == "0") {
        $consult = mysqli_query($sql, "SELECT * FROM pixelplace");
        $strconsult = "";
        while ($pixel = mysqli_fetch_array($consult)) {
            $strconsult = $strconsult . $pixel['coordx'] . "," . $pixel['coordy'] . "," . $pixel['color'] . ";";
        }

        if ($strconsult != "") {
            echo json_encode($strconsult);
        } else {
            echo json_encode("ERROR");
        }
    } else {
        $consult = mysqli_query($sql, "SELECT * FROM pixelplace WHERE uuid >=" . ($uuid - 10));
        $strconsult = "";
        while ($pixel = mysqli_fetch_array($consult)) {
            $strconsult = $strconsult . $pixel['coordx'] . "," . $pixel['coordy'] . "," . $pixel['color'] . ";";
        }

        if ($strconsult != "") {
            echo json_encode($strconsult);
        } else {
            echo json_encode("ERROR");
        }
    }
}

function getPixelByCoords($sql)
{
    $coordx = strval($_POST['coordx']);
    $coordy = strval($_POST['coordy']);
    $consult = mysqli_query($sql, "SELECT * FROM pixelplace WHERE coordx='" . $coordx . "' AND coordy='" . $coordy . "'");
    $strconsult = "";
    while ($pixel = mysqli_fetch_array($consult)) {
        $strconsult = $strconsult . $pixel['coordx'] . "," . $pixel['coordy'] . "," . $pixel['color'];
    }
    if ($strconsult != "") {
        echo json_encode($strconsult);
    } else {
        echo json_encode("ERROR");
    }
}