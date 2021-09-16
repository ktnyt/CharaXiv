package handlers

import "strings"

func cleanSplit(s, sep string) []string {
	if s == "" {
		return nil
	}
	return strings.Split(s, sep)
}
