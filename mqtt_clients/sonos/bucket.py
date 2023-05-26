import boto3


s3 = boto3.resource('s3')
my_bucket = s3.Bucket('digital-twin-bucket')

for object_summary in my_bucket.objects.filter(Prefix="sonos-playlist/"):
    print(object_summary.key)