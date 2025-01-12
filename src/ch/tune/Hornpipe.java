package ch.tune;

public abstract class Hornpipe extends TuneBase {
	
	@Override
	public String getNominalLength() {
		return "1/8";
	}

	@Override
	public String getName() {
		return "Hornpipe";
	}

	@Override
	public String getTempo() {
		return "105";
	}

	@Override
	public String getRhytm() {
		return "Hornpipe";
	}
	
	public String getMeasure() {
		return "2/4";
	}

	@Override
	public boolean doRepeatParts() {
		return true;
	}
}