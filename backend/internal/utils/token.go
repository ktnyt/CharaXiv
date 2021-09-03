package utils

import (
	"crypto/rand"
	"io"
	"sync"
)

var readerMutex = sync.Mutex{}

func NewToken(n int) []byte {
	p := make([]byte, n)
	readerMutex.Lock()
	_, err := io.ReadAtLeast(rand.Reader, p, len(p))
	readerMutex.Unlock()
	if err != nil {
		panic(err)
	}
	return p
}
