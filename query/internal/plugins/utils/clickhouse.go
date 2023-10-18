package pluginUtils

import (
	"context"
	"net"
	"strings"
	"time"

	ch "github.com/ClickHouse/clickhouse-go/v2"
	"github.com/DataObserve/datav/query/pkg/models"
	"github.com/gin-gonic/gin"
)

func ConnectToClickhouse(url, database, username, password string) (ch.Conn, error) {
	conn, err := ch.Open(&ch.Options{
		Addr: strings.Split(url, ","),
		Auth: ch.Auth{
			Database: database,
			Username: username,
			Password: password,
		},
		DialContext: func(ctx context.Context, addr string) (net.Conn, error) {
			var d net.Dialer
			return d.DialContext(ctx, "tcp", addr)
		},
		Debug: false,
		// Debugf: func(format string, v ...any) {
		// 	fmt.Printf(format, v)
		// },
		Settings: ch.Settings{
			"max_execution_time": 60,
		},
		Compression: &ch.Compression{
			Method: ch.CompressionLZ4,
		},
		DialTimeout:          time.Second * 30,
		MaxOpenConns:         5,
		MaxIdleConns:         5,
		ConnMaxLifetime:      time.Duration(10) * time.Minute,
		ConnOpenStrategy:     ch.ConnOpenInOrder,
		BlockBufferSize:      10,
		MaxCompressionBuffer: 10240,
		ClientInfo: ch.ClientInfo{ // optional, please see Client info section in the README.md
			Products: []struct {
				Name    string
				Version string
			}{
				{Name: "my-app", Version: "0.1"},
			},
		},
	})
	if err != nil {
		return nil, err
	}

	err = conn.Ping(context.Background())
	if err != nil {
		return nil, err
	}

	return conn, nil
}

func TestClickhouseDatasource(c *gin.Context) models.PluginResult {
	url := c.Query("url")
	database := c.Query("database")
	username := c.Query("username")
	password := c.Query("password")
	conn, err := ConnectToClickhouse(url, database, username, password)
	if err != nil {
		return models.GenPluginResult(models.PluginStatusError, err.Error(), nil)
	}

	err = conn.Ping(context.Background())
	if err != nil {
		return models.GenPluginResult(models.PluginStatusError, err.Error(), nil)
	}

	return models.GenPluginResult(models.PluginStatusSuccess, "", nil)
}
