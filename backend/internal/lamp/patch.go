package lamp

import (
	"fmt"
	"strings"
)

type Patch struct {
	Key   string
	Value interface{}
}

type Patcher interface {
	Patches() []Patch
}

func JsonPatch(i interface{}, fp []string) []Patch {
	switch t := i.(type) {
	case bool, float64, string, nil, []interface{}:
		key := strings.Join(fp, ".")
		return []Patch{{key, t}}

	case map[string]interface{}:
		patches := make([]Patch, 0, len(t))
		for k, v := range t {
			patches = append(patches, JsonPatch(v, append(fp, k))...)
		}
		return patches

	default:
		panic(fmt.Sprintf("unkown value type %T", t))
	}
}
