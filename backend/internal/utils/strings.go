package utils

func IndexString(ss []string, s string) int {
	for i := range ss {
		if ss[i] == s {
			return i
		}
	}
	return -1
}

func SliceStrings(ss []string, i, j int) []string {
	i, j = Min(i, len(ss)), Min(j, len(ss))
	return ss[i:j]
}
