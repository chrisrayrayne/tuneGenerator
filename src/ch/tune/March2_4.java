package ch.tune;

public abstract class March2_4 extends TuneBase {

	@Override
	public String getName() {
		return "2_4-March";
	}

	@Override
	public String getRhytm() {
		return "March";
	}

	@Override
	public String getTempo() {
		return "1/4=87";
	}

	@Override
	public boolean doRepeatParts() {
		return true;
	}

	@Override
	public String getMeasure() {
		return "2/4";
	}

}
