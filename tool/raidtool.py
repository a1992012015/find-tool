from G8RNG import XOROSHIRO,Raid

# PID = int(sys.argv[1])
# EC = int(sys.argv[2])
# IVs = list(map(lambda x: int(x), sys.argv[3].split(",")))
# usefilters = False if int(sys.argv[4]) == 0 else True
# MaxResults = int(sys.argv[5])
# flawlessiv = int(sys.argv[6])
# HA = int(sys.argv[7])
# RandomGender = int(sys.argv[8])
# IsShinyType = False if int(sys.argv[9]) == 0 else True

# Desired IVs
V6 = [31,31,31,31,31,31]
S0 = [31,31,31,31,31,00]
A0 = [31,00,31,31,31,31]

def get_models(p, e, IVs, u, m, f, h, random, s):
    results = Raid.getseeds(e,p,IVs)
    filter = []

    # Calc frames
    if len(results) > 0:
        seed = results[0][0]
        i = 0
        while i < m:
            r = Raid(seed, f, h, random)
            seed = XOROSHIRO(seed).next()
            if u:
                if s:
                    if r.ShinyType != 'None':
                        filterD = r.print()
                        filterD['index'] = i
                        filter.append(filterD)
                else:
                    if r.ShinyType != 'None' or r.IVs == V6 or r.IVs == S0 or r.IVs == A0:
                        filterD = r.print()
                        filterD['index'] = i
                        filter.append(filterD)
            else:
                filterD = r.print()
                filterD['index'] = i
                filter.append(filterD)
            i += 1
    return filter
