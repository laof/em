package main

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path"
	"strings"
	"time"

	"github.com/tcolgate/mp3"
)

type FileInfo struct {
	Name     string     `json:"name"`
	Size     string     `json:"size"`
	Length   int64      `json:"length"`
	Children []FileInfo `json:"children"`
	Url      string     `json:"url"`
	Time     float64    `json:"time"`
	Lrc      string     `json:"lrc"`
}

type ResData struct {
	Files []FileInfo `json:"files"`
	Time  string     `json:"time"`
}

var fMap = map[string]bool{}
var exc = []string{
	"index.html",
	".gitignore",
	".git",
	".github",
	"go.mod",
	"go.sum",
	"main.go",
	"cmd",
	"output"}

func init() {
	for _, ele := range exc {
		fMap[ele] = true
		fMap["./"+ele] = true
	}
}

var domain = "https://laof.github.io/em/"

func main() {
	save("src/assets/mp3", "list.json")
	fmt.Println("update json file successfully")
}

func save(dir, filename string) {
	var list []FileInfo
	file(dir, &list)

	shanghai, loca := time.LoadLocation("Asia/Shanghai")

	if loca != nil {
		return
	}

	newtime := time.Now().In(shanghai).Format("2006-01-02 15:04:05")

	var rdata = ResData{Time: newtime, Files: list}

	data, _ := json.Marshal(rdata)

	var output = "output"
	os.Mkdir(output, 0755)
	os.WriteFile(output+"/"+filename, data, 0644)

}

func file(dir string, list *[]FileInfo) {

	if fMap[dir] {
		return
	}

	fs, err := os.ReadDir(dir)

	if err != nil {
		return
	}

	for _, e := range fs {

		name := e.Name()

		if dir == "." && fMap[name] {
			continue
		}

		len, _ := e.Info()

		info := FileInfo{Name: name, Length: len.Size(), Size: size(len.Size())}
		if e.IsDir() {
			info.Children = make([]FileInfo, 0)
			file(dir+"/"+name, &info.Children)
		}

		fileExt := path.Ext(name)
		if strings.ToLower(fileExt) == ".mp3" {
			fs := fmt.Sprintf("%v/%v", dir, name)
			info.Time = audiotime(fs)
			info.Url = domain + fs
			info.Name = strings.TrimSuffix(name, fileExt)
			info.Lrc = strings.TrimSuffix(info.Url, fileExt) + ".lrc"
			*list = append(*list, info)
		}

	}
}

func size(bytes int64) string {

	num := float64(bytes)

	if bytes == 0 {
		return "0"
	}

	unit := "KB"
	num = num / 1024

	if num > 1024 {
		num = num / 1024
		unit = "MB"
	}
	if num > 1024 {
		num = num / 1024
		unit = "GB"
	}
	if num > 1024 {
		unit = "TB"
	}

	return fmt.Sprintf("%.2f%v", num, unit)

}

func audiotime(url string) float64 {
	t := 0.0

	r, err := os.Open(url)
	if err != nil {
		fmt.Println(err)
		return t
	}

	d := mp3.NewDecoder(r)
	var f mp3.Frame
	skipped := 0

	for {

		if err := d.Decode(&f, &skipped); err != nil {
			if err == io.EOF {
				break
			}
			fmt.Println(err)
			return t
		}

		t = t + f.Duration().Seconds()
	}

	return t
}
